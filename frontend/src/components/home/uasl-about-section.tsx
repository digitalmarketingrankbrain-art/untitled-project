import Image from "next/image";
import Link from "next/link";
export function UaslAboutSection() {
  return <section className="reference-about">
    <div className="reference-container reference-about-grid">
      <div>
        <p><strong>UASL</strong> is an independent, impartial assessment body responsible for providing assessment of conformity assessment bodies (CABs) in the fields of</p>
        <ul><li>Management System Certification (ISO 9001, ISO 14001 etc.)</li><li>Product Certification</li><li>Personnel Certification</li><li>Inspection</li><li>Rating</li></ul>
        <p>we have been contributing since 1992 in the field of Management System Certification, Personal Certification, and Product Certification services. UASL has been established to provide services to all around the world and would be inviting applications worldwide. UASL will not provide any assessment service in UK territory. Hence Assessment by UASL demonstrates the competence and independence of these CABs in the field of assessment. UASL accredits CABs who in turn certify other organizations.</p>
        <p>UASL has been a persistent pioneer in the field of assessment, well known and respected for its combination of innovative and user-friendly business acumen and its respect for the vigorous maintenance of integrity and impartiality that is the hallmark of the quality assurance profession.</p>
        <p>UASL has pioneered conformity assessment body (CAB), through its performance. Our assessment reporting permits us to monitor the performance of CABs year on year and provides us the ability to determine, in detail, the manner in which CABs are attaining the levels of excellence we demand.</p>
        <p>Assessment by an independent authority means that when you choose a certification body to review your activities you are choosing someone who has been reviewed against defined standards. You will know that they have their own documented operating system and procedures for looking after your interests. You know that assessment by UASL has provided a level of assurance and recourse that is not normally available to business.<br />All organizations certificated by UASL accredited organizations may be independently verified and their current certification status checked <Link href="/certifiedorganization">Certified organization</Link>.</p>
      </div>
      <Image src="/images/uasl/procedure.jpg" width={173} height={240} alt="UASL accredits conformity assessment bodies, who certify or inspect organisations" />
    </div>
  </section>;
}
