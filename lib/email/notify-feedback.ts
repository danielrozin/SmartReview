import { Resend } from "resend";

const NOTIFY_EMAILS = ["daniarozin@gmail.com", "Shai.and1@gmail.com"];

let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

interface SurveyData {
  q1Intent?: string | null;
  q2Found?: boolean | null;
  q2Missing?: string | null;
  q3Rating?: number | null;
  q4Improvement?: string | null;
  q5Discovery?: string | null;
  deviceType?: string | null;
  referralSource?: string | null;
}

export async function notifyNewFeedback(survey: SurveyData) {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping feedback email notification");
    return;
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const lines: string[] = [];

  if (survey.q1Intent) lines.push(`<b>Intent:</b> ${survey.q1Intent}`);
  if (survey.q2Found !== null && survey.q2Found !== undefined)
    lines.push(`<b>Found what they needed:</b> ${survey.q2Found ? "Yes" : "No"}`);
  if (survey.q2Missing) lines.push(`<b>What was missing:</b> ${survey.q2Missing}`);
  if (survey.q3Rating) lines.push(`<b>Rating:</b> ${"★".repeat(survey.q3Rating)}${"☆".repeat(5 - survey.q3Rating)} (${survey.q3Rating}/5)`);
  if (survey.q4Improvement) lines.push(`<b>Improvement suggestion:</b> ${survey.q4Improvement}`);
  if (survey.q5Discovery) lines.push(`<b>Discovery source:</b> ${survey.q5Discovery}`);
  if (survey.deviceType) lines.push(`<b>Device:</b> ${survey.deviceType}`);
  if (survey.referralSource) lines.push(`<b>Referrer:</b> ${survey.referralSource}`);

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a; margin-bottom: 16px;">New feedback from ReviewIQ</h2>
      <div style="background: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
        ${lines.map((l) => `<p style="margin: 8px 0; color: #374151; font-size: 14px;">${l}</p>`).join("")}
      </div>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">Sent automatically by ReviewIQ survey system</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: NOTIFY_EMAILS,
      subject: "New feedback from reviewiq",
      html,
    });
  } catch (err) {
    console.error("Failed to send feedback notification email:", err);
  }
}
