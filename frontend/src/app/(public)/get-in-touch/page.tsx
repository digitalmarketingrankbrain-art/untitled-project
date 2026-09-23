import { ReferenceContactForm } from "@/components/contact/reference-contact-form";
export const metadata = { title:"Get in touch | UASL" };
export default function Page() {
 return <article className="reference-container reference-content"><h1>Get in touch</h1>
  <div className="reference-contact-grid"><ReferenceContactForm /><div><h2>We are located at</h2>
   <p><strong>Reg. Office:</strong> Flat 12, Wentworth Court, Waterside Close, Surbiton, London, KT6 7TT, England</p>
   <p><strong>Work:</strong> 73 Maple Road, Surbiton, London, KT6 4AG, England</p>
   <p>Contact the UASL information desk for accreditation, general &amp; technical enquiries<br />E-mail: <a href="mailto:peter@uasl.uk.com">peter@uasl.uk.com</a></p>
   <p>For other enquiries<br />E-mail: <a href="mailto:info@uasl.uk.com">info@uasl.uk.com</a></p>
  </div></div></article>;
}
