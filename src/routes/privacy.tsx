import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader, STD } from "@/components/site-chrome";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | TRUNK" },
      {
        name: "description",
        content:
          "Read the TRUNK Privacy Policy to understand how we collect, use, disclose, and protect your personal information.",
      },
      { property: "og:title", content: "Privacy Policy | TRUNK" },
      {
        property: "og:description",
        content:
          "Privacy Policy for the TRUNK digital gold ownership platform.",
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
          <p className="body-copy text-charcoal/90"><strong>Last updated: October 23, 2026</strong></p>
          <p className="body-copy mt-5 text-charcoal/90">Fortress Gold Inc., doing business as TRUNK ("TRUNK," "we," "us," or "our"), is a Wyoming corporation operating the website www.trunk.gold and related digital platforms and services.</p>
          <p className="body-copy mt-5 text-charcoal/90">We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect, how we use and share it, how long we keep it, and the rights and choices available to you under applicable United States privacy laws, including California law.</p>
          <p className="body-copy mt-5 text-charcoal/90">By using our website or services, you acknowledge the practices described in this Privacy Policy.</p>
          <nav className="mt-8 rounded-[8px] border border-beige bg-cream/60 p-6">
            <p className="eyebrow text-gold mb-4">On this page</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <a href="#information-we-collect" className="text-sm text-forest transition-colors hover:text-gold">1. Information We Collect</a>
              <a href="#how-we-use-your-information" className="text-sm text-forest transition-colors hover:text-gold">2. How We Use Your Information</a>
              <a href="#information-sharing" className="text-sm text-forest transition-colors hover:text-gold">3. How We Share Personal Information</a>
              <a href="#sensitive-personal-information" className="text-sm text-forest transition-colors hover:text-gold">4. Sensitive Personal Information</a>
              <a href="#automated-processing" className="text-sm text-forest transition-colors hover:text-gold">5. Automated Processing in Identity Verification and Fraud Prevention</a>
              <a href="#data-security" className="text-sm text-forest transition-colors hover:text-gold">6. Data Security</a>
              <a href="#data-retention" className="text-sm text-forest transition-colors hover:text-gold">7. Data Retention</a>
              <a href="#your-rights" className="text-sm text-forest transition-colors hover:text-gold">8. Your Privacy Rights</a>
              <a href="#california-residents" className="text-sm text-forest transition-colors hover:text-gold">9. Additional Privacy Information for California Residents</a>
              <a href="#cookies" className="text-sm text-forest transition-colors hover:text-gold">10. Cookies and Tracking Technologies</a>
              <a href="#marketing-communications" className="text-sm text-forest transition-colors hover:text-gold">11. Marketing Communications</a>
              <a href="#sms-and-text-messaging" className="text-sm text-forest transition-colors hover:text-gold">12. SMS and Text Messaging</a>
              <a href="#payment-processing" className="text-sm text-forest transition-colors hover:text-gold">13. Payment Processing and Third-Party Financial Services</a>
              <a href="#third-party-websites" className="text-sm text-forest transition-colors hover:text-gold">14. Third-Party Websites and Services</a>
              <a href="#childrens-privacy" className="text-sm text-forest transition-colors hover:text-gold">15. Children's Privacy</a>
              <a href="#changes-to-this-policy" className="text-sm text-forest transition-colors hover:text-gold">16. Changes to This Privacy Policy</a>
              <a href="#contact-us" className="text-sm text-forest transition-colors hover:text-gold">17. Contact Us</a>
            </div>
          </nav>
          <h2 id="information-we-collect" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">1. Information We Collect</h2>
          <p className="body-copy mt-5 text-charcoal/90">We collect personal information necessary to provide our services, process transactions, verify identities, protect accounts, and meet applicable legal obligations. Depending on how you interact with TRUNK, this may include the following.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">1.1 Personal and Account Information</h3>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>Full name</li>
            <li>Email address</li>
            <li>Telephone number</li>
            <li>Residential or mailing address</li>
            <li>Date of birth</li>
            <li>Account credentials and preferences</li>
            <li>Other information you voluntarily provide</li>
          </ul>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">1.2 Identity Verification Information</h3>
          <p className="body-copy mt-5 text-charcoal/90">To comply with identity verification, fraud prevention, and financial regulatory requirements, we or our authorized verification providers may collect:</p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>Government-issued identification details</li>
            <li>Copies or images of identity documents</li>
            <li>Address verification information</li>
            <li>Identity verification results</li>
            <li>Information required for Know Your Customer (KYC) and anti-money laundering (AML) procedures</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">Where identity verification is performed by a third-party provider, that provider may collect and process information directly. The information TRUNK receives or keeps depends on the verification service used and applicable legal requirements.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">1.3 Financial and Payment Information</h3>
          <p className="body-copy mt-5 text-charcoal/90">When you make a payment or connect a financial account, we and our payment service providers may process:</p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>Bank account identifiers and limited account information</li>
            <li>Payment method and transaction details</li>
            <li>Payment authorization and confirmation information</li>
            <li>Billing information</li>
            <li>Fraud prevention and payment verification data</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">We use third-party service providers, including Stripe and Plaid, for payment and financial account connection services. Sensitive payment credentials are handled through those providers' secure systems. TRUNK does not collect or store online banking passwords or complete payment card numbers through its own systems.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">1.4 Gold Transaction Information</h3>
          <p className="body-copy mt-5 text-charcoal/90">When you use TRUNK to purchase, hold, sell back, or redeem eligible gold products, we may collect:</p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>Purchase, sale, and transaction history</li>
            <li>Gold holdings and ownership records</li>
            <li>Payment and settlement information</li>
            <li>Redemption and sell-back requests</li>
            <li>Delivery or fulfillment information, where applicable</li>
            <li>Customer service records relating to transactions</li>
          </ul>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">1.5 Website and Usage Information</h3>
          <p className="body-copy mt-5 text-charcoal/90">When you visit our website or use our services, we and our advertising and analytics partners may automatically collect:</p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device and operating system information</li>
            <li>Pages visited and interactions with our services</li>
            <li>Session and referral information</li>
            <li>Approximate location derived from IP address</li>
            <li>Cookies, pixels, and similar technical identifiers</li>
            <li>Website performance and diagnostic information</li>
          </ul>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">1.6 Communications</h3>
          <p className="body-copy mt-5 text-charcoal/90">We may collect information you provide when you:</p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>Contact customer support</li>
            <li>Submit an inquiry</li>
            <li>Subscribe to updates or marketing communications</li>
            <li>Respond to surveys</li>
            <li>Communicate with us by email, telephone, or text message</li>
          </ul>
          <h2 id="how-we-use-your-information" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">2. How We Use Your Information</h2>
          <p className="body-copy mt-5 text-charcoal/90">We use personal information to:</p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>Create, manage, and secure customer accounts.</li>
            <li>Process gold purchases, sales, payments, and eligible redemptions.</li>
            <li>Maintain accurate ownership, transaction, and account records.</li>
            <li>Verify identities and prevent fraud, money laundering, and unauthorized activity.</li>
            <li>Comply with legal, tax, financial, and regulatory obligations.</li>
            <li>Respond to inquiries and provide customer support.</li>
            <li>Send account notifications, security alerts, and transaction confirmations.</li>
            <li>Send marketing communications where permitted by law and in line with your preferences.</li>
            <li>Measure and improve our advertising, including through the advertising partners described in Section 3.5.</li>
            <li>Analyze platform performance and improve our products and services.</li>
            <li>Detect, investigate, and respond to security incidents or suspected misuse.</li>
            <li>Enforce our agreements and protect the rights, property, and safety of TRUNK, our customers, and others.</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">We do not use personal information for purposes that are materially incompatible with those described in this Policy without providing notice and obtaining any consent required by law.</p>
          <h2 id="information-sharing" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">3. How We Share Personal Information</h2>
          <p className="body-copy mt-5 text-charcoal/90">We disclose personal information only where reasonably necessary for the purposes described in this Policy or as permitted or required by law. Recipients include the following.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">3.1 Payment and Financial Service Providers</h3>
          <p className="body-copy mt-5 text-charcoal/90">We work with payment processors and financial technology providers, including Stripe and Plaid, to facilitate payments, financial account connections, verification, and fraud prevention. These providers may process information under their own privacy policies and contractual obligations.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">3.2 Identity Verification and Compliance Providers</h3>
          <p className="body-copy mt-5 text-charcoal/90">We share information with authorized identity verification, fraud prevention, sanctions-screening, and compliance service providers.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">3.3 Gold Suppliers, Custodians, and Fulfillment Partners</h3>
          <p className="body-copy mt-5 text-charcoal/90">Where necessary to complete a transaction, we disclose relevant information to gold suppliers, vault custodians, storage providers, delivery partners, and other fulfillment providers.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">3.4 Technology and Communications Providers</h3>
          <p className="body-copy mt-5 text-charcoal/90">We use third-party technology providers, including AWS, Cloudflare, Twilio, and Customer.io, to support website hosting, infrastructure, security, account messaging, and platform operations.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">3.5 Advertising Partners</h3>
          <p className="body-copy mt-5 text-charcoal/90">We use advertising and measurement technologies provided by Meta, Google, and Reddit on our website. These partners may collect identifiers and information about your interactions with our website through cookies and pixels, and may use that information to deliver and measure TRUNK advertising across other websites and apps. Under California law, this is considered "sharing" personal information for cross-context behavioral advertising. You can opt out as described in Section 8.4.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">3.6 Professional Advisers and Regulatory Authorities</h3>
          <p className="body-copy mt-5 text-charcoal/90">We may disclose information to legal advisers, auditors, insurers, regulators, law enforcement agencies, or other authorized parties where reasonably necessary or legally required.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">3.7 Business Transfers</h3>
          <p className="body-copy mt-5 text-charcoal/90">If TRUNK is involved in a merger, acquisition, restructuring, financing, or sale of assets, personal information may be disclosed or transferred as part of that transaction, subject to applicable law.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">3.8 Sale and Sharing of Personal Information</h3>
          <p className="body-copy mt-5 text-charcoal/90">TRUNK does not sell personal information. In the preceding 12 months, TRUNK has not sold personal information to any third party.</p>
          <p className="body-copy mt-5 text-charcoal/90">TRUNK shares identifiers and internet or network activity information with Meta, Google, and Reddit for cross-context behavioral advertising, as described in Section 3.5. We do not share sensitive personal information, identity documents, or financial account information with advertising partners.</p>
          <h2 id="sensitive-personal-information" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">4. Sensitive Personal Information</h2>
          <p className="body-copy mt-5 text-charcoal/90">Some information we collect is classified as sensitive personal information under applicable privacy laws, including government identification details, financial account information, and account log-in credentials.</p>
          <p className="body-copy mt-5 text-charcoal/90">We use and disclose sensitive personal information only to:</p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>Provide the products and services you request</li>
            <li>Process and secure financial transactions</li>
            <li>Verify your identity</li>
            <li>Prevent and investigate fraud and unauthorized activity</li>
            <li>Maintain account and transaction records</li>
            <li>Meet legal and regulatory obligations</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">We do not use sensitive personal information to infer characteristics about you, and we do not use or disclose it for advertising or marketing.</p>
          <h2 id="automated-processing" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">5. Automated Processing in Identity Verification and Fraud Prevention</h2>
          <p className="body-copy mt-5 text-charcoal/90">Our identity verification and fraud prevention providers use automated tools to check identity documents, screen against sanctions lists, and flag unusual activity. These tools assist our compliance team. They do not make final decisions on their own.</p>
          <p className="body-copy mt-5 text-charcoal/90">Any decision to decline an account application, restrict an account, or block a transaction is reviewed by a member of our compliance team before it becomes final. If you believe a decision about your account was made in error, contact compliance@trunk.gold and we will review it.</p>
          <h2 id="data-security" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">6. Data Security</h2>
          <p className="body-copy mt-5 text-charcoal/90">We maintain administrative, technical, and organizational safeguards designed to protect personal information against unauthorized access, disclosure, alteration, misuse, and loss. These measures include:</p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>Encryption of information in transit and at rest</li>
            <li>Restricted access to sensitive information</li>
            <li>Authentication and access management controls, including text message verification at sign-in</li>
            <li>Secure payment and identity verification integrations</li>
            <li>Security monitoring and incident response procedures</li>
            <li>Security requirements for third-party service providers</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">No method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security. If a security incident occurs, we will investigate it and provide notifications where required by law.</p>
          <h2 id="data-retention" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">7. Data Retention</h2>
          <p className="body-copy mt-5 text-charcoal/90">We keep personal information only as long as reasonably necessary for the purposes described in this Policy, including legal, regulatory, accounting, security, and operational requirements.</p>
          <PolicyTable
            caption="Retention periods by information category"
            headers={["Information category", "Retention period"]}
            rows={[
              ["Account information", "While your account is active, then 5 years after account closure"],
              ["Identity verification and KYC records", "5 years after account closure, as required for anti-money laundering compliance"],
              ["Payment and financial transaction records", "5 years after the transaction, or longer where tax law requires"],
              ["Gold transaction and ownership records", "5 years after the transaction or after the holding is sold back or redeemed, whichever is later"],
              ["Customer support communications", "Until the inquiry is resolved, then up to 3 years to address follow-up questions or disputes"],
              ["Marketing preferences and subscriptions", "Until you unsubscribe or ask us to delete them. We keep a record of your opt-out so we can continue to honor it"],
              ["Website analytics and advertising data", "Up to 26 months, subject to each provider's retention settings"],
            ]}
          />
          <p className="body-copy mt-5 text-charcoal/90">When personal information is no longer required, we delete, de-identify, or securely dispose of it, unless continued retention is required or permitted by law. Deleting a TRUNK account does not immediately delete records we must keep for compliance, fraud prevention, dispute resolution, or other lawful purposes.</p>
          <h2 id="your-rights" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">8. Your Privacy Rights</h2>
          <p className="body-copy mt-5 text-charcoal/90">Depending on your state of residence and applicable law, you may have the right to:</p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>Request access to personal information we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of personal information, subject to legal exceptions.</li>
            <li>Request a portable copy of certain personal information.</li>
            <li>Opt out of the sale or sharing of personal information, or of targeted advertising.</li>
            <li>Withdraw consent where processing is based on consent.</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">We will not discriminate against you for exercising your privacy rights.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">8.1 Submitting a Privacy Request</h3>
          <p className="body-copy mt-5 text-charcoal/90">To submit a privacy request, email compliance@trunk.gold or call +1 (254) 455-5959. Please include enough information for us to identify your account and understand your request.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">8.2 How We Verify Requests</h3>
          <p className="body-copy mt-5 text-charcoal/90">To protect your account, we verify your identity before responding. For most requests, we match the information you provide against the details on your account and may send a code to the email address or phone number we have on file. For requests to access specific pieces of information or to delete information, we may ask for additional details that match our records. We use any information you provide for verification only for that purpose.</p>
          <p className="body-copy mt-5 text-charcoal/90">We will acknowledge your request within 10 business days and respond within 45 calendar days. If we need more time, we will tell you, and we may extend our response by up to a further 45 days where permitted by law.</p>
          <p className="body-copy mt-5 text-charcoal/90">Some requests may be declined or limited where exceptions apply, including where information must be kept to complete transactions, prevent fraud, comply with legal obligations, or protect security. If we decline a request, we will explain why.</p>
          <h2 id="california-residents" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">9. Additional Privacy Information for California Residents</h2>
          <p className="body-copy mt-5 text-charcoal/90">This section applies to California residents and supplements the rest of this Policy. It describes our practices under the California Consumer Privacy Act, as amended by the California Privacy Rights Act (together, the "CCPA"), and the California Online Privacy Protection Act.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">9.1 Personal Information We Collect and Disclose</h3>
          <p className="body-copy mt-5 text-charcoal/90">In the preceding 12 months, we have collected and disclosed the following categories of personal information.</p>
          <PolicyTable
            caption="Categories of personal information collected and disclosed in the preceding 12 months"
            headers={["Category", "Sources", "Purposes", "Disclosed to", "Sold or shared"]}
            rows={[
              ["Identifiers (name, email, address, phone, IP address, account and device identifiers)", "You; your device; verification providers", "Account management, transactions, verification, security, support, advertising", "Payment, verification, technology, and fulfillment providers; advertising partners (IP address and device identifiers only)", "Not sold. Shared with Meta, Google, and Reddit (IP address and device identifiers only)"],
              ["Customer records under Cal. Civ. Code §1798.80(e) (contact, identification, and financial information)", "You; payment and verification providers", "Transactions, verification, compliance", "Payment, verification, compliance, and fulfillment providers; regulators where required", "No"],
              ["Commercial information (purchases, holdings, sell-backs, transaction history)", "You; your use of our services", "Transactions, records, compliance, support", "Payment and fulfillment providers; custodians; regulators where required", "No"],
              ["Internet or network activity (pages visited, interactions, referral data)", "Your device, through cookies and pixels", "Security, analytics, advertising", "Technology providers; advertising partners", "Not sold. Shared with Meta, Google, and Reddit"],
              ["Approximate geolocation (from IP address)", "Your device", "Security, fraud prevention, analytics", "Technology and verification providers", "No"],
              ["Sensitive personal information (government ID, financial account information, log-in credentials)", "You; verification and payment providers", "Verification, payments, fraud prevention, security, compliance (see Section 4)", "Verification, payment, and compliance providers; regulators where required", "No"],
              ["Inferences (interests derived from website interactions)", "Your use of our website", "Advertising measurement", "Advertising partners", "Not sold. Shared with Meta, Google, and Reddit"],
            ]}
          />
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">9.2 Your California Rights</h3>
          <p className="body-copy mt-5 text-charcoal/90">California residents have the right to:</p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li><strong>Know:</strong> Request the categories and specific pieces of personal information we collected, the sources, our purposes, and the categories of third parties we disclosed it to.</li>
            <li><strong>Delete:</strong> Request deletion of personal information, subject to legal exceptions.</li>
            <li><strong>Correct:</strong> Request correction of inaccurate personal information.</li>
            <li><strong>Opt out of sharing:</strong> Direct us not to share personal information for cross-context behavioral advertising.</li>
            <li><strong>Portability:</strong> Receive eligible personal information in a portable, readily usable format.</li>
            <li><strong>Non-discrimination:</strong> Exercise your rights without discriminatory treatment.</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90"><strong>Right to limit:</strong> We use sensitive personal information only for the purposes permitted under the CCPA regulations (Cal. Code Regs. tit. 11, §7027(m)), as described in Section 4. Because of this, the right to limit the use of sensitive personal information does not apply.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">9.3 Exercising Your California Rights</h3>
          <p className="body-copy mt-5 text-charcoal/90">Submit requests by email to compliance@trunk.gold or by phone at +1 (254) 455-5959. We verify requests as described in Section 8.2.</p>
          <p className="body-copy mt-5 text-charcoal/90">You may use an authorized agent to submit a request on your behalf. We may ask the agent for signed permission from you and may ask you to verify your identity directly with us.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">9.4 How to Opt Out of Sharing</h3>
          <p className="body-copy mt-5 text-charcoal/90">You can opt out of sharing for cross-context behavioral advertising by:</p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>Clicking the Do Not Sell or Share My Personal Information link in the footer of our website, or</li>
            <li>Enabling Global Privacy Control (GPC) in a supported browser or extension. We treat a GPC signal as a valid opt-out request for that browser and, if you are signed in, for your account.</li>
          </ul>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">9.5 Do Not Track</h3>
          <p className="body-copy mt-5 text-charcoal/90">We treat a browser Do Not Track signal the same way as a GPC signal: as a request to opt out of sharing for that browser. When we receive either signal, we do not load Meta, Google, or Reddit advertising pixels for that browser.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">9.6 Minors</h3>
          <p className="body-copy mt-5 text-charcoal/90">We do not sell personal information, and we do not knowingly share the personal information of consumers under 16 years of age.</p>
          <h3 className="font-display mt-8 text-lg font-semibold text-forest-deep">9.7 Information Covered by Other Laws</h3>
          <p className="body-copy mt-5 text-charcoal/90">Some personal information we collect in connection with financial transactions may be subject to the Gramm-Leach-Bliley Act or other federal or state financial privacy laws. To the extent those laws apply, that information may be exempt from certain CCPA requirements. This does not affect the rights described in this Policy for other personal information.</p>
          <h2 id="cookies" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">10. Cookies and Tracking Technologies</h2>
          <p className="body-copy mt-5 text-charcoal/90">TRUNK uses cookies, pixels, and similar technologies for the following purposes:</p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li><strong>Essential:</strong> Required for website functionality and security, including Cloudflare security and performance services.</li>
            <li><strong>Preferences:</strong> Remember your settings.</li>
            <li><strong>Analytics:</strong> Understand website traffic and performance.</li>
            <li><strong>Advertising:</strong> Meta, Google, and Reddit pixels used to deliver and measure TRUNK advertising, as described in Section 3.5.</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">You can manage cookies through your browser settings, opt out of sharing as described in Section 9.4, and use the opt-out tools offered by Meta, Google, and Reddit in your account settings with those services. Disabling essential cookies may affect website functionality.</p>
          <h2 id="marketing-communications" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">11. Marketing Communications</h2>
          <p className="body-copy mt-5 text-charcoal/90">We may send marketing communications about TRUNK products, platform updates, and other relevant information where permitted by law.</p>
          <p className="body-copy mt-5 text-charcoal/90">You can unsubscribe from marketing emails at any time using the unsubscribe link in the message or by contacting compliance@trunk.gold. Opting out of marketing does not stop essential transactional, account security, legal, or service-related communications.</p>
          <h2 id="sms-and-text-messaging" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">12. SMS and Text Messaging</h2>
          <p className="body-copy mt-5 text-charcoal/90">TRUNK sends text messages for account verification, security notifications, payment confirmations, transaction updates, and customer support, where permitted by law and based on any required consent.</p>
          <p className="body-copy mt-5 text-charcoal/90">Where TRUNK offers promotional or marketing text messages, we will obtain any separate consent required by law. Consent to receive marketing text messages is not a condition of purchase.</p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>Message frequency varies based on account activity and the messaging program.</li>
            <li>Message and data rates may apply.</li>
            <li>Reply STOP to opt out of a text messaging program.</li>
            <li>Reply HELP for assistance, or contact compliance@trunk.gold.</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">Mobile phone numbers and SMS consent information are not sold or shared with third parties for their own marketing purposes. Wireless carriers are not liable for delayed or undelivered messages. Opting out of a text messaging program does not prevent essential account communications through other channels.</p>
          <h2 id="payment-processing" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">13. Payment Processing and Third-Party Financial Services</h2>
          <p className="body-copy mt-5 text-charcoal/90">TRUNK uses third-party financial technology and payment service providers to support the following payment methods, where offered:</p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>ACH bank transfers</li>
            <li>Credit and debit card payments</li>
            <li>Bank account connections through Plaid</li>
            <li>Wire transfers</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">Certain payment methods may be subject to additional terms, eligibility requirements, or third-party privacy policies. Payment providers may collect information directly from you and process it as necessary to provide their services, comply with law, and prevent fraud.</p>
          <p className="body-copy mt-5 text-charcoal/90">TRUNK receives payment confirmations, limited financial account information, transaction identifiers, and other information needed to administer purchases and maintain accurate records. We never ask customers to provide online banking passwords directly to TRUNK.</p>
          <h2 id="third-party-websites" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">14. Third-Party Websites and Services</h2>
          <p className="body-copy mt-5 text-charcoal/90">Our website and platform may contain links to or integrations with third-party websites and services that have their own privacy policies. We encourage you to review those policies before providing personal information. TRUNK is not responsible for the independent privacy practices of third parties outside our control, except to the extent required by law.</p>
          <h2 id="childrens-privacy" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">15. Children's Privacy</h2>
          <p className="body-copy mt-5 text-charcoal/90">TRUNK's services are intended for individuals 18 years of age or older. We do not knowingly collect personal information from children under 18. If we learn that we have collected personal information from a minor, we will delete it or otherwise handle it as required by law. If you believe a minor has provided personal information to TRUNK, contact compliance@trunk.gold.</p>
          <h2 id="changes-to-this-policy" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">16. Changes to This Privacy Policy</h2>
          <p className="body-copy mt-5 text-charcoal/90">We review this Privacy Policy at least once every 12 months and may update it to reflect changes in our services, practices, technology, or legal obligations. When we make changes, we will update the "Last updated" date at the top of this Policy. Where required by law, we will provide additional notice or obtain consent before making material changes.</p>
          <h2 id="contact-us" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">17. Contact Us</h2>
          <p className="body-copy mt-5 text-charcoal/90">If you have questions about this Privacy Policy, wish to exercise your privacy rights, or have concerns about how your personal information is handled, contact:</p>
          <p className="body-copy mt-5 text-charcoal/90">Fortress Gold Inc. DBA TRUNK<br />Website: www.trunk.gold<br />Email: compliance@trunk.gold<br />Telephone: +1 (254) 455-5959<br />Registered jurisdiction: Wyoming, United States<br />Business mailing address: 10410 Corprate Dr Ste 107, Sugar Land TX 77478</p>
          <p className="body-copy mt-5 text-charcoal/90">© 2026 Fortress Gold Inc. DBA TRUNK. All rights reserved.</p>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

function PolicyTable({ caption, headers, rows }: { caption: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-lg border border-beige" tabIndex={0} role="region" aria-label={caption}>
      <table className={`body-copy w-full border-collapse text-left text-charcoal/90 ${headers.length > 2 ? "min-w-[720px]" : ""}`}>
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-cream">
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col" className="border-b border-beige px-4 py-3 align-top font-semibold text-forest-deep">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-beige last:border-b-0">
              {row.map((cell, i) => (
                <td key={i} className="px-4 py-3 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
