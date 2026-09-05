/**
 * Transactional email abstraction.
 * Phase 1: no provider is connected. Callers should treat a skipped send as success for UX,
 * and never log secrets.
 */

export type EmailEvent =
  | "student_registration"
  | "student_application"
  | "business_enquiry"
  | "contact_enquiry";

export type EmailPayload = {
  to: string;
  event: EmailEvent;
  subject: string;
  text: string;
};

export async function sendTransactionalEmail(payload: EmailPayload): Promise<{ sent: boolean; reason?: string }> {
  const provider = process.env.EMAIL_PROVIDER ?? "none";

  if (provider === "none" || !process.env.RESEND_API_KEY) {
    return { sent: false, reason: "email_not_configured" };
  }

  void payload;
  return { sent: false, reason: "provider_not_implemented" };
}
