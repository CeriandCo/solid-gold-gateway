import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader, STD } from "@/components/site-chrome";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | SQOOT Pure" },
      {
        name: "description",
        content:
          "Read the SQOOT Pure Privacy Policy to understand how we collect, use, disclose, and protect your personal information.",
      },
      { property: "og:title", content: "Privacy Policy | SQOOT Pure" },
      {
        property: "og:description",
        content:
          "Privacy Policy for the SQOOT Pure digital gold ownership platform.",
      },
      { property: "og:url", content: "https://solid-gold-gateway.lovable.app/privacy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://solid-gold-gateway.lovable.app/privacy",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-warm-white">
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-forest-deep py-16 text-warm-white sm:py-20 lg:py-24">
          <div className={STD}>
            <div className="mx-auto max-w-[760px]">
              <p className="eyebrow text-gold mb-4">Legal</p>
              <h1 className="font-display text-3xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem]">
                Privacy Policy
              </h1>
            </div>
          </div>
        </section>

        <article className={"mx-auto max-w-[760px] px-5 py-14 text-forest-deep sm:py-18 lg:py-22"}>
          <p className="body-copy text-charcoal/90">
            Last updated: April 16, 2026
          </p>

          <p className="body-copy mt-5 text-charcoal/90">
            Fortress Gold Inc. DBA Sqoot ("Sqoot Pure," "we," "us," or "our") operates the website getsqoot.com and related services. This Privacy Policy describes how we collect, use, disclose, and protect your personal information when you visit our website or use our platform.
          </p>

          <h2 id="information-we-collect" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            1. Information We Collect
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            We may collect the following types of information:
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            <strong>Account Information:</strong> Name, email address, phone number, date of birth, and government-issued identification for KYC (Know Your Customer) verification.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            <strong>Financial Information:</strong> When you make a payment through Stripe, we may receive certain account and transaction information authorized by you and necessary for payment processing, account verification, fraud prevention, and related services. We do not store your bank credentials, card numbers, or payment authentication data — these are handled exclusively by Stripe.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            <strong>Transaction Data:</strong> Records of gold purchases, gifts, and redemptions made through the platform.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            <strong>Usage Data:</strong> Browser type, IP address, pages visited, time spent on pages, and other analytics data collected through cookies and similar technologies.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            <strong>Communication Data:</strong> Emails, support inquiries, and newsletter subscriptions.
          </p>

          <h2 id="how-we-use-your-information" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            2. How We Use Your Information
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            We use the information we collect to:
          </p>
          <ul className="body-copy mt-4 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>process and fulfill gold transactions on the platform;</li>
            <li>verify your identity in compliance with applicable KYC and anti-money laundering (AML) regulations;</li>
            <li>maintain your account and provide customer support;</li>
            <li>send transactional emails, platform updates, and marketing communications (with your consent);</li>
            <li>improve our website, platform, and services;</li>
            <li>comply with legal obligations and regulatory requirements.</li>
          </ul>

          <h2 id="information-sharing" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            3. Information Sharing
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            We do not sell your personal information. We may share information with:
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            <strong>Service Providers</strong> — third-party vendors who assist with payment processing (Stripe), identity verification, vault custody, and infrastructure hosting (AWS, Cloudflare);
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            <strong>Regulatory Authorities</strong> — as required by law, including compliance with AML, tax reporting, and other regulatory obligations;
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            <strong>Business Partners</strong> — vault custodians and gold supply partners who need transaction details to fulfill your orders.
          </p>

          <h2 id="data-security" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            4. Data Security
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            We implement security controls appropriate to our current stage and risk profile to protect your information, including AES-256 encryption for data at rest, TLS encryption for data in transit, and field-level encryption for sensitive personal data. Access to personal information is restricted to authorized personnel only.
          </p>

          <h2 id="data-retention" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            5. Data Retention
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Payment, compliance, and KYC records are retained for the legally required period under applicable financial regulations. Stripe-processed payment data is retained only as needed for payment processing, fraud and risk review, reconciliation, and legal obligations. Non-required data is deleted within 30 days of a deletion request. We may retain certain information after account closure as required by law or for legitimate business purposes such as resolving disputes and enforcing agreements.
          </p>

          <h2 id="your-rights" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            6. Your Rights
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Depending on your jurisdiction, you may have the right to: access, correct, or delete your personal information; withdraw consent for marketing communications; request a copy of your data in a portable format; object to certain types of data processing.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            To exercise these rights, contact us at compliance@sqoot.us.
          </p>

          <h2 id="cookies" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            7. Cookies
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            We use cookies and similar tracking technologies to analyze website traffic and improve your experience. You can control cookie preferences through your browser settings. We use Cloudflare analytics for performance monitoring.
          </p>

          <h2 id="third-party-links" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            8. Third-Party Links
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies.
          </p>

          <h2 id="childrens-privacy" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            9. Children's Privacy
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from minors.
          </p>

          <h2 id="changes-to-this-policy" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            10. Changes to This Policy
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance of the revised policy.
          </p>

          <h2 id="sms-and-text-messaging" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            11. SMS and Text Messaging
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            By providing your phone number during account registration, through our website contact forms, or through our live chat, you consent to receive text messages from Sqoot Pure related to your account, including order confirmations, shipping notifications, KYC verification updates, payment receipts, and customer support responses.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Message and data rates may apply. Message frequency varies based on your account activity. You can opt out at any time by replying STOP to any message. For help, reply HELP to any message or contact us at +1 (254) 455-5959, +1 (920) 776-6863, or through our contact form. We do not share your phone number with third parties for marketing purposes. Carriers are not liable for delayed or undelivered messages.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            By consenting to receive text messages, you confirm that you are the owner or authorized user of the phone number provided. Your consent is not a condition of purchase.
          </p>

          <h2 id="stripe-payment-integration" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            12. Stripe Payment Integration
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            We use regulated payment processors to handle all transactions — including ACH bank transfer, RTP, and wire transfer. When you initiate a payment, your bank account details are transmitted directly to our payment processor and are never stored by SQOOT Pure. We receive only the transaction confirmation and limited account details necessary to fulfill your order.
          </p>

          <h2 id="contact-us" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            13. Contact Us
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            If you have questions or concerns about this Privacy Policy, please contact us through our contact form on getsqoot.com.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Fortress Gold Inc. DBA Sqoot<br />
            Website: getsqoot.com
          </p>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
