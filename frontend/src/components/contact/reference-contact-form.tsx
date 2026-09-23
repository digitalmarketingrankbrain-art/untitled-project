"use client";
import { useState } from "react";
export function ReferenceContactForm({ feedback = false }: { feedback?: boolean }) {
  const [draftReady, setDraftReady] = useState(false);
  return <form className="reference-form" onSubmit={event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = String(data.get("subject") || (feedback ? "Website feedback" : "Website enquiry"));
    const body = ["Name: " + data.get("name"), "Email: " + data.get("email"), ...(feedback ? [] : ["Contact No.: " + data.get("phone")]), "", String(data.get("message"))].join("\n");
    window.location.href = "mailto:info@uasl.uk.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    setDraftReady(true);
  }}>
    <div><label htmlFor="contact-name">Name *</label><input id="contact-name" name="name" autoComplete="name" required /></div>
    {!feedback && <div><label htmlFor="contact-phone">Contact No. *</label><input id="contact-phone" type="tel" name="phone" autoComplete="tel" required /></div>}
    <div><label htmlFor="contact-email">E-Mail *</label><input id="contact-email" type="email" name="email" autoComplete="email" required /></div>
    <div><label htmlFor="contact-subject">Subject{feedback ? " *" : ""}</label><input id="contact-subject" name="subject" required={feedback} /></div>
    <div><label htmlFor="contact-message">Message *</label><textarea id="contact-message" name="message" required /></div>
    <button type="submit">Submit</button>
    <p className="reference-form-note">Submit opens an email draft. Send it from your email app to complete your enquiry.</p>
    {draftReady && <p role="status">Your email draft is ready. If your email app did not open, email info@uasl.uk.com directly. Your message has not been sent by this website.</p>}
  </form>;
}

