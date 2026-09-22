import PDFDocument from "pdfkit";
import { prisma } from "../prisma";

// TODO: replace with SAAF's real registered address and banking details before
// this invoice is used for an actual payment collection — these are placeholders.
const SAAF_ISSUER = {
  name: "South Asia Accreditation Foundation (SAAF)",
  addressLines: ["[SAAF Registered Address Line 1]", "[City, State, ZIP]", "[Country]"],
  email: "accounts@saaf-accreditation.org",
};
const SAAF_BANK = {
  accountName: "[SAAF Bank Account Name — PLACEHOLDER]",
  bankName: "[Bank Name — PLACEHOLDER]",
  accountNumber: "[Account Number — PLACEHOLDER]",
  routingNo: "[Routing / IFSC No. — PLACEHOLDER]",
  swiftBic: "[SWIFT / BIC — PLACEHOLDER]",
};

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function chunkToWords(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n]!;
  if (n < 100) return `${TENS[Math.floor(n / 10)]}${n % 10 ? " " + ONES[n % 10] : ""}`;
  return `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? " " + chunkToWords(n % 100) : ""}`;
}

/** Converts a non-negative amount to English words, e.g. 6375 -> "Six Thousand Three Hundred Seventy Five". Whole-dollar amounts only (no fractional cents in words). */
function amountToWords(amount: number): string {
  const n = Math.round(amount);
  if (n === 0) return "Zero";
  const parts: string[] = [];
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;
  if (crore) parts.push(`${chunkToWords(crore)} Crore`);
  if (lakh) parts.push(`${chunkToWords(lakh)} Lakh`);
  if (thousand) parts.push(`${chunkToWords(thousand)} Thousand`);
  if (rest) parts.push(chunkToWords(rest));
  return parts.join(" ");
}

function fmtDate(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : "—";
}

interface InvoicePdfData {
  invoiceNumber: string;
  status: string;
  issuedAt: Date | null;
  dueAt: Date | null;
  currency: string;
  amount: number;
  organisationName: string;
  organisationAddressLines: string[];
  lineItems: { description: string; amount: number }[];
}

function buildInvoicePdfBuffer(data: InvoicePdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width - 80;

    // Header band: issuer identity + invoice number/date.
    doc.rect(40, 40, pageWidth, 70).stroke();
    doc.fontSize(14).font("Helvetica-Bold").fillColor("#0f172a").text(SAAF_ISSUER.name, 50, 52, { width: pageWidth - 20 });
    doc.fontSize(9).font("Helvetica").fillColor("#475569");
    doc.text(SAAF_ISSUER.addressLines.join(", "), 50, 70, { width: pageWidth - 20 });
    doc.text(SAAF_ISSUER.email, 50, 84);

    doc.moveDown(3);
    const infoY = 120;
    doc.rect(40, infoY, pageWidth, 24).stroke();
    doc.rect(40, infoY, pageWidth / 2, 24).stroke();
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#0f172a").text("Invoice Number", 50, infoY + 7, { continued: true }).font("Helvetica").text(`   ${data.invoiceNumber}`);
    doc.font("Helvetica-Bold").text("Dated", 40 + pageWidth / 2 + 10, infoY + 7, { continued: true }).font("Helvetica").text(`   ${fmtDate(data.issuedAt)}`);

    // Bill-to block.
    let y = infoY + 40;
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#0f172a").text("BILLED TO", 40, y);
    y += 14;
    doc.font("Helvetica-Bold").fontSize(11).text(data.organisationName, 40, y, { width: pageWidth });
    y += 16;
    doc.font("Helvetica").fontSize(9).fillColor("#475569");
    for (const line of data.organisationAddressLines) {
      doc.text(line, 40, y, { width: pageWidth });
      y += 12;
    }

    // Line items table.
    y += 14;
    const col1 = 40, col2 = 80, col3 = 40 + pageWidth - 90;
    const rowHeight = 20;
    doc.rect(40, y, pageWidth, rowHeight).fillAndStroke("#1d4ed8", "#1d4ed8");
    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(9);
    doc.text("S.No", col1 + 4, y + 6);
    doc.text("Description", col2 + 4, y + 6);
    doc.text("Amount", col3, y + 6, { width: 90 - 4, align: "right" });
    y += rowHeight;

    doc.font("Helvetica").fontSize(9).fillColor("#0f172a");
    data.lineItems.forEach((item, i) => {
      doc.rect(40, y, pageWidth, rowHeight).stroke();
      doc.text(String(i + 1), col1 + 4, y + 6);
      doc.text(item.description, col2 + 4, y + 6, { width: col3 - col2 - 8 });
      doc.text(`${data.currency} ${item.amount.toLocaleString()}`, col3, y + 6, { width: 90 - 4, align: "right" });
      y += rowHeight;
    });

    const subTotal = data.lineItems.reduce((s, li) => s + li.amount, 0);
    const totalsRow = (label: string, value: string, bold = false) => {
      doc.rect(40, y, pageWidth, rowHeight).stroke();
      doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(9).text(label, col2 + 4, y + 6, { width: col3 - col2 - 8, align: "right" });
      doc.text(value, col3, y + 6, { width: 90 - 4, align: "right" });
      y += rowHeight;
    };
    totalsRow("Sub Total (Pre-Taxes)", `${data.currency} ${subTotal.toLocaleString()}`);
    totalsRow("Taxes, if any", "—");
    totalsRow("Grand Total", `${data.currency} ${data.amount.toLocaleString()}`, true);
    totalsRow("Net Payable on this Invoice", `${data.currency} ${data.amount.toLocaleString()}`, true);

    y += 6;
    doc.font("Helvetica-Oblique").fontSize(8).fillColor("#475569")
      .text(`(${data.currency} ${amountToWords(data.amount)} Only)`, 40, y, { width: pageWidth });
    y += 20;

    if (data.dueAt) {
      doc.font("Helvetica").fontSize(8).fillColor("#b45309")
        .text(`Remarks: Payment due by ${fmtDate(data.dueAt)}. Status: ${data.status}.`, 40, y, { width: pageWidth });
      y += 20;
    }

    // Payment instructions.
    y += 10;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#0f172a").text("Payment / Wire Transfer Details", 40, y);
    y += 14;
    doc.font("Helvetica").fontSize(8).fillColor("#475569");
    const bankLines = [
      `Account Name: ${SAAF_BANK.accountName}`,
      `Bank Name: ${SAAF_BANK.bankName}`,
      `Account Number: ${SAAF_BANK.accountNumber}`,
      `Routing / IFSC No.: ${SAAF_BANK.routingNo}`,
      `SWIFT / BIC: ${SAAF_BANK.swiftBic}`,
    ];
    for (const line of bankLines) {
      doc.text(line, 40, y, { width: pageWidth });
      y += 11;
    }

    y += 16;
    doc.font("Helvetica-Oblique").fontSize(8).fillColor("#94a3b8")
      .text("Being a computer-generated document, signature is not required.", 40, y, { width: pageWidth });

    doc.end();
  });
}

export async function getInvoicePdf(
  invoiceId: string,
): Promise<{ buffer: Buffer; filename: string; organisationId: string } | undefined> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { lineItems: true, organisation: true },
  });
  if (!invoice) return undefined;

  const org = invoice.organisation;
  const addressLines = [org.address, [org.city, org.state, org.postalCode].filter(Boolean).join(", "), org.country].filter(
    (l): l is string => Boolean(l && l.trim()),
  );

  const buffer = await buildInvoicePdfBuffer({
    invoiceNumber: invoice.invoiceNumber,
    status: invoice.status,
    issuedAt: invoice.issuedAt,
    dueAt: invoice.dueAt,
    currency: invoice.currency,
    amount: Number(invoice.amount),
    organisationName: org.displayName,
    organisationAddressLines: addressLines.length > 0 ? addressLines : ["—"],
    lineItems: invoice.lineItems.map((li) => ({ description: li.description, amount: Number(li.amount) })),
  });

  return { buffer, filename: `${invoice.invoiceNumber}.pdf`, organisationId: invoice.organisationId };
}
