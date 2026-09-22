import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAgreementPdf } from "@/lib/portal/agreement-pdf";
import { getUserOrganisationId } from "@/lib/auth/store";

/** Session-authenticated Agreement for Accreditation download — same pattern as /api/certificates/[certificateId]. */
export async function GET(request: Request, { params }: { params: Promise<{ organisationId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { organisationId } = await params;

  if (session.user.role === "APPLICANT") {
    const ownOrganisationId = await getUserOrganisationId(session.user.id);
    if (ownOrganisationId !== organisationId) {
      return NextResponse.json({ error: "Not authorised to access this organisation's agreement." }, { status: 403 });
    }
  } else if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorised." }, { status: 403 });
  }

  const agreement = await getAgreementPdf(organisationId);
  if (!agreement) {
    return NextResponse.json({ error: "Organisation not found." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(agreement.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${agreement.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
