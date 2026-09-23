import { ReferenceContactForm } from "@/components/contact/reference-contact-form";
export const metadata = { title:"Feedback | UASL" };
export default function Page() {
 return <article className="reference-container reference-content"><h1>Feedback and complaints</h1>
 <p>UASL welcomes any comments or complaints in relation to the services we provide. It helps us to identify anything that we do well, or need to improve.</p>
 <p>These services include the activities of Accredited Bodies.</p>
 <p>UASL ensures that Accredited Bodies are taking action against complaints in a timely manner.</p>
 <h2>How do I make a complaint?</h2>
 <p>Complaints can be submitted through mail or email or fill below form.</p>
 <p>You will receive an acknowledgment of your complaint within 15 working days if your comment or complaint is valid.</p>
 <p>Your comment or complaint will be investigated and you will be informed of what action has taken place to all concerned. You will receive feedback on a regular basis until a complaint is resolved.</p>
 <ReferenceContactForm feedback /></article>;
}
