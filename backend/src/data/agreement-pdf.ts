import PDFDocument from "pdfkit";
import { prisma } from "../prisma";

const SAAF_NAME = "South Asia Accreditation Foundation (SAAF)";

/**
 * ⚠️ Structure only — the clause wording below is a generic, SAAF-authored
 * paraphrase (not copied from any third-party AB's contract) and the
 * governing-law clause is left as an explicit placeholder. This has NOT been
 * reviewed by counsel; do not treat it as a binding agreement until SAAF's
 * own legal counsel has drafted/approved the actual terms and jurisdiction.
 */
const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "1. Introduction",
    body: [
      "This Agreement sets out the relationship between SAAF and the accredited Certification Body (\"CB\"), and the standards and conditions to be met by the CB in the operation of accredited certification.",
      "Both SAAF and the CB are expected to abide by the letter, spirit, and intent of this Agreement. A CB applying for accreditation is expected to act as an accredited CB as part of complying with the requirements for accreditation; the term \"accredited CB\" therefore also covers applicant CBs for the purposes of this Agreement.",
    ],
  },
  {
    heading: "2. Accreditation of Certification Bodies",
    body: [
      "SAAF accredits management-system, product, process, service, and other conformity-assessment certification against the applicable International Standards (e.g. ISO/IEC 17021-1, ISO/IEC 17020, ISO/IEC 17024, ISO/IEC 17025, ISO/IEC 17065) using applicable IAF/regional mandatory documents and SAAF's own published accreditation criteria.",
      "A CB applying for accreditation will undergo assessment by SAAF to determine its competence and conformity with the standard(s) against which accreditation is sought. Where accreditation is granted, an accreditation certificate is issued for a defined period, conditional on the CB continuing to comply with the terms of this Agreement, demonstrating continuing conformity and competence, and paying the fees due to SAAF.",
      "SAAF will determine the frequency of surveillance with reference to the scope and scale of the CB's accredited activity and based on risk, and reserves the right to carry out additional or unscheduled surveillance or reassessment visits as it may reasonably require.",
      "If an accredited CB fails to comply with the terms of this Agreement, the relevant accreditation criteria, or the conditions for use of the SAAF accreditation symbol, SAAF may withdraw accreditation, reduce its scope, impose a moratorium on the issue of accredited certificates, require reassessment, or impose other sanctions as appropriate.",
      "Information gained by SAAF in its direct dealings with the CB, other than information already in the public domain, will be treated as confidential and will not be divulged without the CB's prior written consent, subject to applicable law.",
    ],
  },
  {
    heading: "3. Conditions to Be Met by Accredited Certification Bodies",
    body: [
      "The accredited CB shall, at all times: comply with this Agreement and the relevant accreditation standards and procedures; provide SAAF with reasonable access and cooperation to verify fulfilment of accreditation requirements, including access to CB personnel, locations, equipment, information, documents and records; arrange witnessing of certification activities when reasonably requested by SAAF; only claim accreditation for activities within its current schedule of accreditation; use the SAAF accreditation symbol only on certificates within its accredited scope, per SAAF's symbol-use policy; pay all fees due to SAAF promptly; and not use its accreditation in a manner SAAF considers misleading.",
      "The CB shall inform SAAF, at the time of application and subsequently without delay, of any significant changes relevant to its accreditation — including changes to its legal, commercial, ownership, or organisational status; top management and key personnel; policies and procedures; premises, personnel, equipment or other resources; and the countries in which it operates or issues accredited certificates.",
      "Upon withdrawal of accreditation, the CB shall immediately discontinue any reference to accreditation, withdraw related advertising, return its certificate of accreditation, and take such action with existing accredited clients as SAAF may require.",
      "An accredited CB wishing to relinquish its SAAF accreditation shall give SAAF at least ninety (90) days' written notice, stating the arrangements made for protection of clients holding accredited certification and settlement of fees due to SAAF.",
    ],
  },
  {
    heading: "4. Appeals",
    body: [
      "Appeals may be lodged against an accreditation decision made by SAAF (a decision to grant, suspend, or withdraw accreditation, to grant or deny a scope extension, to reduce scope, or to reject an application at any stage). Such a decision stands pending the outcome of any appeal. Appeals are processed in accordance with SAAF's published Appeals Procedure.",
    ],
  },
  {
    heading: "5. Complaints",
    body: ["Any complaint against SAAF or an accredited CB should be addressed to SAAF in writing, in accordance with SAAF's published Complaints Procedure."],
  },
  {
    heading: "6. Assignment",
    body: ["Except as otherwise agreed by the parties in writing, accreditation granted under this Agreement shall not be assigned to any other party."],
  },
  {
    heading: "7. Liability",
    body: [
      "No representation, promise, or warranty — express or implied — is made or given as to the accuracy or completeness of any information, review, audit, or advice supplied by SAAF or its officers, employees, or agents in the course of providing services under this Agreement, and no such representation, promise, or warranty shall be relied upon by the accredited CB.",
    ],
  },
  {
    heading: "8. Force Majeure",
    body: ["Neither party shall be liable for any failure or delay in performance to the extent such failure or delay arises from causes reasonably beyond that party's control."],
  },
  {
    heading: "9. Indemnity",
    body: ["The accredited CB undertakes to indemnify SAAF against any losses suffered by, or claims made against, SAAF as a result of misuse by the CB of any accreditation or symbol granted by SAAF, or as a result of any breach by the CB of the terms of this Agreement."],
  },
  {
    heading: "10. Use of the Accreditation Symbol",
    body: ["The accredited CB may use the SAAF accreditation symbol and other claims of accreditation only in accordance with SAAF's published \"Conditions for Use of the SAAF Accreditation Symbol,\" and agrees to ensure compliance with those conditions is enforced among its own certified clients."],
  },
  {
    heading: "11. Governing Law",
    body: [
      "[PLACEHOLDER] Governing law and jurisdiction to be inserted once confirmed by SAAF's legal counsel. This Agreement is not binding until this clause is finalised.",
    ],
  },
  {
    heading: "12. Dispute Resolution",
    body: ["Disputes arising out of or in connection with this Agreement that cannot be resolved by mutual agreement shall be referred to arbitration or such other dispute-resolution mechanism as SAAF's governing documents specify."],
  },
  {
    heading: "13. Termination",
    body: [
      "This Agreement continues in force until terminated: (a) by either party upon ninety (90) days' written notice to the other; or (b) immediately by SAAF, in accordance with SAAF's procedures, as formally notified in advance to the accredited CB.",
      "At the date of termination, the CB's accreditation immediately ceases to be valid, but the CB remains bound by the confidentiality, indemnity, and dispute-resolution provisions of this Agreement.",
    ],
  },
];

function buildAgreementPdfBuffer(data: { organisationName: string; organisationAddress: string; generatedDate: string }): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 56 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(9).font("Helvetica-Bold").fillColor("#b45309").text(
      "DRAFT — for review only. This document has not been reviewed by legal counsel and does not constitute a binding agreement.",
      { align: "center" },
    );
    doc.moveDown(1);
    doc.fontSize(16).font("Helvetica-Bold").fillColor("#0f172a").text("Agreement for Accreditation", { align: "center" });
    doc.fontSize(11).font("Helvetica").fillColor("#475569").text("for Certification Bodies", { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(9).font("Helvetica").fillColor("#334155");
    doc.text(
      `This Agreement is made as of ${data.generatedDate} between ${SAAF_NAME}, and the accredited certification body ` +
        `${data.organisationName}${data.organisationAddress ? `, having its principal office at ${data.organisationAddress}` : ""}, ` +
        `hereinafter referred to as the "CB", which expression shall include its successors and assignees.`,
      { align: "left" },
    );
    doc.moveDown(1);

    for (const section of SECTIONS) {
      if (doc.y > doc.page.height - 140) doc.addPage();
      doc.fontSize(11).font("Helvetica-Bold").fillColor("#1d4ed8").text(section.heading);
      doc.moveDown(0.3);
      for (const para of section.body) {
        doc.fontSize(9).font("Helvetica").fillColor("#334155").text(para, { align: "left" });
        doc.moveDown(0.5);
      }
      doc.moveDown(0.3);
    }

    doc.addPage();
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#0f172a").text("Signatures");
    doc.moveDown(1);
    const colWidth = (doc.page.width - 112) / 2;

    doc.fontSize(9).font("Helvetica-Bold").text("For the Accredited CB", 56, doc.y, { width: colWidth });
    doc.font("Helvetica-Bold").text("For SAAF", 56 + colWidth + 20, doc.y - 11, { width: colWidth });
    doc.moveDown(2);

    const sigY = doc.y;
    doc.font("Helvetica").fontSize(9);
    doc.text("Name: ____________________________", 56, sigY, { width: colWidth });
    doc.text("Name: ____________________________", 56 + colWidth + 20, sigY, { width: colWidth });
    doc.moveDown(1.5);
    doc.text("Signed: ____________________________", 56, doc.y, { width: colWidth });
    doc.text("Signed: ____________________________", 56 + colWidth + 20, doc.y - 11, { width: colWidth });
    doc.moveDown(1.5);
    doc.text("Position: ____________________________", 56, doc.y, { width: colWidth });
    doc.text("Position: Director, SAAF", 56 + colWidth + 20, doc.y - 11, { width: colWidth });
    doc.moveDown(1.5);
    doc.text("Date: ____________________________", 56, doc.y, { width: colWidth });
    doc.text("Date: ____________________________", 56 + colWidth + 20, doc.y - 11, { width: colWidth });

    doc.end();
  });
}

export async function getAgreementPdf(
  organisationId: string,
): Promise<{ buffer: Buffer; filename: string } | undefined> {
  const org = await prisma.organisation.findUnique({ where: { id: organisationId } });
  if (!org) return undefined;

  const addressLines = [org.address, [org.city, org.state, org.postalCode].filter(Boolean).join(", "), org.country].filter(
    (l): l is string => Boolean(l && l.trim()),
  );

  const buffer = await buildAgreementPdfBuffer({
    organisationName: org.displayName,
    organisationAddress: addressLines.join(", "),
    generatedDate: new Date().toISOString().slice(0, 10),
  });

  return { buffer, filename: `SAAF-Agreement-for-Accreditation-DRAFT-${org.displayName.replace(/\s+/g, "-")}.pdf` };
}
