import nodemailer, { type Transporter } from "nodemailer";

/**
 * Real email delivery over SMTP (nodemailer). Configure with env vars:
 *   SMTP_HOST, SMTP_PORT (default 587), SMTP_USER, SMTP_PASS,
 *   SMTP_SECURE ("true" for implicit TLS, usually port 465),
 *   MAIL_FROM (e.g. "SAAF <no-reply@yourdomain.com>"; defaults to SMTP_USER).
 *
 * When SMTP isn't configured, nothing is pretended: the message is logged and
 * `sendMail` resolves with `{ sent: false }` so callers can tell the user the
 * email was NOT delivered.
 */

let transporter: Transporter | null = null;

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter(): Transporter {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!isMailConfigured()) {
    console.warn(`[mail] SMTP not configured — NOT sent. To: ${input.to} · Subject: ${input.subject}`);
    return { sent: false, error: "Email is not configured on the server (SMTP settings missing)." };
  }
  try {
    await getTransporter().sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    return { sent: true };
  } catch (err) {
    console.error(`[mail] send failed to ${input.to}:`, err);
    return { sent: false, error: err instanceof Error ? err.message : "Email send failed." };
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
