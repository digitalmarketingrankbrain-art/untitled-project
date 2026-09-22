import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDocumentVersionForDownload } from "@/lib/portal/document-data";
import { readDocumentFile, documentFileExists } from "@/lib/storage";
import { getApplicationByIdAdmin } from "@/lib/portal/applicant-data";
import { getUserOrganisationId } from "@/lib/auth/store";

/**
 * Never a public URL — Phase 1's document-security requirement. This route
 * is the session-authenticated equivalent of an object store's short-lived
 * signed URL: every request re-checks who's asking and whether they're
 * allowed to see this specific document, rather than the file living at a
 * guessable or bookmarkable public path.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ versionId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { versionId } = await params;
  const version = await getDocumentVersionForDownload(versionId);
  if (!version) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const authorized = await isAuthorizedForDocument(session.user.id, session.user.role, version.document.ownerId, version.document.ownerType);
  if (!authorized) {
    return NextResponse.json({ error: "Not authorised to access this document." }, { status: 403 });
  }

  if (!(await documentFileExists(version.storageKey))) {
    return NextResponse.json({ error: "File is missing from storage." }, { status: 404 });
  }

  const buffer = await readDocumentFile(version.storageKey);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": version.mimeType,
      "Content-Disposition": `attachment; filename="${version.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

async function isAuthorizedForDocument(
  userId: string,
  role: string,
  ownerId: string,
  ownerType: string,
): Promise<boolean> {
  if (role === "ADMIN") return true;

  if (ownerType === "ORGANISATION") {
    if (role !== "APPLICANT") return false;
    const organisationId = await getUserOrganisationId(userId);
    return organisationId === ownerId;
  }

  if (ownerType !== "APPLICATION") return false;

  const application = await getApplicationByIdAdmin(ownerId);
  if (!application) return false;
  if (role === "APPLICANT") return application.applicantUserId === userId;
  if (role === "ASSESSOR") return application.assessorUserId === userId;
  return false;
}
