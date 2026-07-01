export const COMPANY_CONFIG = {
  CONFIDENTIAL_LINKS: {
    PRICING: "https://proptryx.app/pricing/",
    TERMS_OF_SERVICE: "https://www.proptryx.app/terms-of-service",
    PRIVACY_POLICY_DEVELOPER:
      "https://www.proptryx.app/privacy-policy-developer",
    PRIVACY_POLICY_OCCUPIER: "https://www.proptryx.app/privacy-policy-occupier",
  },
  LINKS: {
    WEBSITE_URL: "https://proptryx.com",
    SOFTWARE_URL: "https://software.proptryx.app",
  },
  CONTACT: {
    CONTACT_SUPPORT: "https://wa.me/919832800571",
    WHATSAPP_NUMBER: "+919832800571",
  },
  EMAILS: {
    SUPPORT_EMAIL: "support@proptryx.com",
    ADMIN_EMAIL: "admin@proptryx.com",
  },
  QUICK_MESSAGES: {
    AUTH: {
      CREATE_ACCOUNT:
        "Hello Team, I need help creating and verifying my PropTryx account.",
      FORGOT_PASSWORD:
        "Hello Team, I need help recovering access to my PropTryx account.",
      RESET_PASSWORD:
        "Hello Team, I verified my reset code but need help setting a new password.",
      SIGN_IN:
        "Hello Team, I need help signing in to my PropTryx account with my password.",
      SIGN_IN_WITH_OTP:
        "Hello Team, I need help receiving or using a one-time sign-in code.",
      TWO_FACTOR:
        "Hello Team, I need help completing two-factor verification for my PropTryx account.",
      VERIFY_OTP:
        "Hello Team, I need help verifying the one-time code for my PropTryx account.",
    },
    RATELIMIT_ISSUE:
      "Hello%20Team%2C%20I%20am%20facing%20rate-limiting%20issues%20on%20my%20account.%20Please%20help.",
    ACCOUNT_BANNED:
      "Hello%20Team%2C%20I%20would%20like%20to%20inquire%20about%20the%20status%20of%20my%20account.%20Please%20assist.",
    COMPANY_INACTIVE:
      "Hello%20Team%2C%20I%20would%20like%20to%20inquire%20about%20the%20status%20of%20my%20company%20account.%20Please%20assist.",
    CONTACT_SUPPORT:
      "Hello%20HisaabSathi%20Support%2C%20I%20need%20assistance%20with%20my%20account.",
  },
} as const;

export function createCompanySupportHref(message: string): string {
  return `${COMPANY_CONFIG.CONTACT.CONTACT_SUPPORT}?text=${encodeURIComponent(message)}`;
}
