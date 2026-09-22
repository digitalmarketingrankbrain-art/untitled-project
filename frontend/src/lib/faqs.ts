export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface FaqAudience {
  key: string;
  label: string;
  faqs: Faq[];
}

export const FAQ_AUDIENCES: FaqAudience[] = [
  {
    key: "applicants",
    label: "Applicants",
    faqs: [
      {
        id: "how-long",
        question: "How long does accreditation take?",
        answer:
          "Timelines vary by program and the completeness of your application. See the full process page for a stage-by-stage breakdown.",
      },
      {
        id: "what-if-fail",
        question: "What happens if I don't pass assessment?",
        answer:
          "You'll receive documented findings explaining what didn't meet the criteria. You may address the findings and request a follow-up assessment, or appeal the decision through Complaints & Appeals.",
      },
      {
        id: "cost",
        question: "What does accreditation cost?",
        answer: "See Accreditation → Fees for program-specific fee guidance.",
      },
    ],
  },
  {
    key: "accredited-organisations",
    label: "Accredited Organisations",
    faqs: [
      {
        id: "renewal",
        question: "When do I need to renew?",
        answer:
          "Renewal and surveillance deadlines are shown in your portal dashboard well ahead of the due date, with reminders sent at configured intervals.",
      },
      {
        id: "suspension",
        question: "What can cause a suspension?",
        answer:
          "Suspension typically follows an unresolved non-conformance identified during surveillance. You'll be notified with the specific reason and a path to reinstatement where applicable.",
      },
    ],
  },
  {
    key: "verification-users",
    label: "Verification Users",
    faqs: [
      {
        id: "how-to-verify",
        question: "How do I check if an accreditation is real?",
        answer:
          "Use the Verify tool with the accreditation number or organisation name — no account needed. See Verify an Accreditation.",
      },
      {
        id: "not-found",
        question: "The accreditation I was shown doesn't appear when I search. What does that mean?",
        answer:
          "It means we have no matching public record for what you searched. Double-check the reference number, and consider reporting it if you believe the claim was fabricated or misused.",
      },
    ],
  },
  {
    key: "assessors",
    label: "Assessors",
    faqs: [
      {
        id: "become-assessor",
        question: "How do I become an assessor?",
        answer:
          "Start at Become an Assessor to express interest. Admin reviews expressions of interest and provisions an account for eligible candidates.",
      },
      {
        id: "assignment-access",
        question: "What can I see once I'm assigned to an assessment?",
        answer:
          "Only the documents and records relevant to that specific assignment — you won't have visibility into other assessors' assignments or unrelated applications.",
      },
    ],
  },
];
