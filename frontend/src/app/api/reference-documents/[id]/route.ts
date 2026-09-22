import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getReferenceDocumentForDownload } from "@/lib/portal/reference-documents";
import { readDocumentFile, documentFileExists } from "@/lib/storage";

/**
 * AB reference documents are visible to every signed-in CB (not organisation-
 * scoped) — still gated behind a real session rather than a public URL, per
 * the project's private-storage rule.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { id } = await params;
  const doc = await getReferenceDocumentForDownload(id);
  if (!doc) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }
  if (!(await documentFileExists(doc.storageKey))) {
    return NextResponse.json({ error: "File is missing from storage." }, { status: 404 });
  }

  const buffer = await readDocumentFile(doc.storageKey);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Disposition": `attachment; filename="${doc.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
