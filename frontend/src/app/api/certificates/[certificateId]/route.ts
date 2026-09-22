import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCertificateForDownload } from "@/lib/portal/certificate-data";
import { readDocumentFile, documentFileExists } from "@/lib/storage";
import { getUserOrganisationId } from "@/lib/auth/store";

/**
 * Session-authenticated certificate download — same pattern as
 * /api/documents/[versionId] (never a public/guessable URL). ADMIN sees
 * every certificate; APPLICANT only their own organisation's.
 */
export async function GET(request: Request, { params }: { params: Promise<{ certificateId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { certificateId } = await params;
  const cert = await getCertificateForDownload(certificateId);
  if (!cert) {
    return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
  }

  if (session.user.role === "APPLICANT") {
    const organisationId = await getUserOrganisationId(session.user.id);
    if (organisationId !== cert.organisationId) {
      return NextResponse.json({ error: "Not authorised to access this certificate." }, { status: 403 });
    }
  } else if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorised to access this certificate." }, { status: 403 });
  }

  if (!(await documentFileExists(cert.storageKey))) {
    return NextResponse.json({ error: "File is missing from storage." }, { status: 404 });
  }

  const buffer = await readDocumentFile(cert.storageKey);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${cert.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
