import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getInvoicePdf } from "@/lib/portal/invoice-pdf";
import { getUserOrganisationId } from "@/lib/auth/store";

/** Session-authenticated invoice PDF download — same pattern as /api/certificates/[certificateId]. */
export async function GET(request: Request, { params }: { params: Promise<{ invoiceId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { invoiceId } = await params;
  const invoice = await getInvoicePdf(invoiceId);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  if (session.user.role === "APPLICANT") {
    const organisationId = await getUserOrganisationId(session.user.id);
    if (organisationId !== invoice.organisationId) {
      return NextResponse.json({ error: "Not authorised to access this invoice." }, { status: 403 });
    }
  } else if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorised to access this invoice." }, { status: 403 });
  }

  return new NextResponse(new Uint8Array(invoice.buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
