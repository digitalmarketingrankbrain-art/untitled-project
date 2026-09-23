import Link from "next/link";
const cards = [
  { title: "Management System", copy: "UASL offers assessment for the following management system certification schemes.....", href: "/management-system-certification", action: "Read more" },
  { title: "Accrediated Body", copy: "If you wish to check out the name of Assessed Body to verify the assessment criteria.....", href: "/accredited-body", action: "Read more" },
  { title: "Certified Organisation", copy: "If you wish to check out the status of an organization Check here.", href: "/certifiedorganization", action: "Check Here" },
];
export function UaslHomeCards() {
  return <section className="reference-container reference-services" aria-label="Assessment services">
    {cards.map(card => <div className="reference-service" key={card.href}>
      <h2>{card.title}</h2><p>{card.copy}</p><Link href={card.href}>{card.action}</Link>
    </div>)}
  </section>;
}
