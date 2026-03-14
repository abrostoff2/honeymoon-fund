import { Resend } from "resend";
import { config } from "@/config";
import { renderEcardHtml, getEcardName } from "./email-ecards";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface ContributionData {
  id: string;
  guestName: string;
  guestEmail: string;
  amount: number;
  message: string | null;
  paymentMethod: string;
  ecardTemplate: string | null;
  ecardMessage: string | null;
}

function getPaymentDetail(method: string): string {
  switch (method) {
    case "venmo":
      return `@${config.payments.venmo.handle} on Venmo`;
    case "zelle":
      return `${config.payments.zelle.email} via Zelle`;
    case "cashapp":
      return `$${config.payments.cashapp.handle} on Cash App`;
    default:
      return method;
  }
}

const methodLabels: Record<string, string> = {
  venmo: "Venmo",
  zelle: "Zelle",
  cashapp: "Cash App",
};

export async function sendContributionNotification(
  contribution: ContributionData
) {
  if (!resend || !process.env.COUPLE_EMAIL) return;

  const method = methodLabels[contribution.paymentMethod] ?? contribution.paymentMethod;

  const ecardHtml = contribution.ecardTemplate
    ? renderEcardHtml(
        contribution.ecardTemplate,
        contribution.guestName,
        config.coupleName,
        contribution.ecardMessage || ""
      )
    : "";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; color: #2C2C2C;">
      <div style="padding: 24px 0; border-bottom: 1px solid #eee; margin-bottom: 24px;">
        <h2 style="margin: 0; font-size: 20px; color: #1a1a1a;">New gift from ${contribution.guestName}</h2>
      </div>

      <table style="width: 100%; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;">Amount</td>
          <td style="padding: 8px 0; text-align: right; font-size: 18px; font-weight: 600; color: #1a1a1a;">$${contribution.amount.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;">Payment method</td>
          <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #1a1a1a;">${method}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;">Email</td>
          <td style="padding: 8px 0; text-align: right; font-size: 14px; color: #1a1a1a;">${contribution.guestEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666; font-size: 14px;">Status</td>
          <td style="padding: 8px 0; text-align: right;">
            <span style="display: inline-block; background: #fef3c7; color: #b45309; font-size: 12px; font-weight: 500; padding: 2px 10px; border-radius: 12px;">Pending</span>
          </td>
        </tr>
      </table>

      ${contribution.message ? `
      <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 4px; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Message</p>
        <p style="margin: 0; font-size: 15px; color: #1a1a1a; line-height: 1.5;">&ldquo;${contribution.message}&rdquo;</p>
      </div>` : ""}

      ${ecardHtml ? `
      <div style="margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">E-card: ${getEcardName(contribution.ecardTemplate!)}</p>
        ${ecardHtml}
      </div>` : ""}

      <div style="padding-top: 16px; border-top: 1px solid #eee;">
        <p style="margin: 0; font-size: 13px; color: #999;">
          Log in to your admin dashboard to confirm when the payment arrives.
        </p>
      </div>
    </div>`;

  await resend.emails.send({
    from: "Honeymoon Fund <noreply@resend.dev>",
    to: process.env.COUPLE_EMAIL,
    subject: `New gift from ${contribution.guestName} — $${contribution.amount}`,
    html,
  });
}

export async function sendNudgeEmail(contribution: ContributionData) {
  if (!resend) return;

  const method = methodLabels[contribution.paymentMethod] ?? contribution.paymentMethod;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; color: #2C2C2C;">
      <h2 style="margin: 0 0 16px; font-size: 20px; color: #1a1a1a;">Hi ${contribution.guestName},</h2>

      <p style="font-size: 15px; line-height: 1.6; color: #444;">
        Just a friendly reminder about your <strong>$${contribution.amount.toLocaleString()}</strong> honeymoon fund gift via <strong>${method}</strong>.
      </p>

      <p style="font-size: 15px; line-height: 1.6; color: #444;">
        If you haven&rsquo;t had a chance to send it yet, no worries! Here are the payment details:
      </p>

      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 8px; font-size: 14px;"><strong>Amount:</strong> $${contribution.amount.toLocaleString()}</p>
        <p style="margin: 0 0 8px; font-size: 14px;"><strong>Method:</strong> ${method}</p>
        <p style="margin: 0; font-size: 14px;"><strong>Send to:</strong> ${getPaymentDetail(contribution.paymentMethod)}</p>
      </div>

      <p style="font-size: 15px; line-height: 1.6; color: #444;">
        Thank you for your generosity!
      </p>

      <p style="font-size: 13px; color: #999; margin-top: 32px;">
        &mdash; ${config.coupleName}
      </p>
    </div>`;

  await resend.emails.send({
    from: "Honeymoon Fund <noreply@resend.dev>",
    to: contribution.guestEmail,
    subject: `Friendly reminder — Honeymoon Fund gift`,
    html,
  });
}
