import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader, STD } from "@/components/site-chrome";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use | SQOOT Pure" },
      {
        name: "description",
        content:
          "Read the SQOOT Pure Terms of Use governing access to getsqoot.com and related services operated by Fortress Gold Inc. DBA Sqoot.",
      },
      { property: "og:title", content: "Terms of Use | SQOOT Pure" },
      {
        property: "og:description",
        content:
          "Terms of Use for the SQOOT Pure digital gold ownership platform.",
      },
      { property: "og:url", content: "https://solid-gold-gateway.lovable.app/terms" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://solid-gold-gateway.lovable.app/terms",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-warm-white">
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-forest-deep py-16 text-warm-white sm:py-20 lg:py-24">
          <div className={STD}>
            <div className="mx-auto max-w-[760px]">
              <p className="eyebrow text-gold mb-4">Legal</p>
              <h1 className="font-display text-3xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem]">
                Terms of Use
              </h1>
            </div>
          </div>
        </section>

        <article className={"mx-auto max-w-[760px] px-5 py-14 text-forest-deep sm:py-18 lg:py-22"}>
          <p className="body-copy text-charcoal/90">Last updated: May 5, 2026</p>
          <p className="body-copy mt-5 text-charcoal/90">
            These Terms of Use (&quot;Terms&quot;) govern your access to and use of getsqoot.com and related services (&quot;Platform&quot;) operated by Fortress Gold Inc. DBA Sqoot (&quot;Sqoot Pure,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), a Wyoming Corporation. By accessing or using the Platform, you agree to be bound by these Terms.
          </p>
          <nav className="mt-8 rounded-[8px] border border-beige bg-cream/60 p-6">
            <p className="eyebrow text-gold mb-4">On this page</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <a href="#program-description" className="text-sm text-forest transition-colors hover:text-gold">1. Program Description</a>
              <a href="#eligibility" className="text-sm text-forest transition-colors hover:text-gold">2. Eligibility</a>
              <a href="#account-registration-kyc" className="text-sm text-forest transition-colors hover:text-gold">3. Account Registration and KYC</a>
              <a href="#payment-methods" className="text-sm text-forest transition-colors hover:text-gold">4. Payment Methods</a>
              <a href="#pricing-and-fees" className="text-sm text-forest transition-colors hover:text-gold">5. Pricing and Fees</a>
              <a href="#gold-ownership-and-storage" className="text-sm text-forest transition-colors hover:text-gold">6. Gold Ownership and Storage</a>
              <a href="#redemption-and-delivery" className="text-sm text-forest transition-colors hover:text-gold">7. Redemption and Delivery</a>
              <a href="#sms-and-text-messaging-terms" className="text-sm text-forest transition-colors hover:text-gold">8. SMS and Text Messaging Terms</a>
              <a href="#prohibited-uses" className="text-sm text-forest transition-colors hover:text-gold">9. Prohibited Uses</a>
              <a href="#intellectual-property" className="text-sm text-forest transition-colors hover:text-gold">10. Intellectual Property</a>
              <a href="#limitation-of-liability" className="text-sm text-forest transition-colors hover:text-gold">11. Limitation of Liability</a>
              <a href="#disclaimer-of-warranties" className="text-sm text-forest transition-colors hover:text-gold">12. Disclaimer of Warranties</a>
              <a href="#governing-law" className="text-sm text-forest transition-colors hover:text-gold">13. Governing Law</a>
              <a href="#changes-to-these-terms" className="text-sm text-forest transition-colors hover:text-gold">14. Changes to These Terms</a>
              <a href="#commodity-risk-and-market-movement" className="text-sm text-forest transition-colors hover:text-gold">15. Commodity Risk and Market Movement</a>
              <a href="#refund-policy-all-sales-final" className="text-sm text-forest transition-colors hover:text-gold">16. Refund Policy — All Sales Final</a>
              <a href="#contact-us" className="text-sm text-forest transition-colors hover:text-gold">17. Contact Us</a>
            </div>
          </nav>


          <h2 id="program-description" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            1. Program Description
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Sqoot Pure is a digital platform for purchasing, storing, gifting, and redeeming physical gold. Gold is classified as a commodity under US law. Sqoot Pure is not a securities broker, investment advisor, bank, or money services business. We provide infrastructure for direct physical gold ownership.
          </p>

          <h2 id="eligibility" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            2. Eligibility
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            You must be at least 18 years old and a US resident to use the Platform. By creating an account, you represent that you meet these requirements and that all information you provide is accurate and complete.
          </p>

          <h2 id="account-registration-kyc" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            3. Account Registration and KYC
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            To use the Platform, you must create an account and complete identity verification (Know Your Customer / KYC). As part of our BSA/AML compliance program, we are required to verify all customers. Failure to complete KYC will prevent access to buying, selling, and gifting features.
          </p>

          <h2 id="payment-methods" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            4. Payment Methods
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            SQOOT Pure accepts the following payment methods: (1) ACH bank transfer up to $100,000 per transaction with same-day settlement; (2) RTP instant bank payment; and (3) wire transfer. No cash, no cards, and no cryptocurrency accepted. Payment processing is subject to identity verification and may be delayed pending AML review. SQOOT Pure reserves the right to add, modify, or remove supported payment methods with notice to users.
          </p>

          <h2 id="pricing-and-fees" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            5. Pricing and Fees
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold prices are based on live spot prices sourced from global exchanges (COMEX, LME, LBMA, DGCX, Perth Mint). A transparent platform fee is applied per transaction. All pricing is displayed before you confirm a purchase. Prices are indicative and may change between the time a quote is viewed and a transaction is confirmed.
          </p>

          <h2 id="gold-ownership-and-storage" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            6. Gold Ownership and Storage
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            All gold purchased on the Platform is physically allocated and stored in insured, audited vault facilities through institutional-grade custodians. You retain full ownership of your gold. Vault storage fees, if applicable, will be disclosed at the time of purchase.
          </p>

          <h2 id="redemption-and-delivery" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            7. Redemption and Delivery
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            You may redeem your SQOOT Pure gold at any time. Redemption is the process for exiting a gold position or requesting physical delivery. Depending on the redemption method available in your account, you may request an ACH cash payout based on the current live spot price, less disclosed platform and processing fees, or request physical delivery through an insured carrier. Redemption requests are subject to processing times, identity verification, available liquidity, shipping requirements, and applicable fees.
          </p>

          <h2 id="sms-and-text-messaging-terms" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            8. SMS and Text Messaging Terms
          </h2>
          <h3 className="font-display mt-8 text-xl font-medium leading-[1.15] tracking-[-0.01em] text-forest-deep sm:text-2xl">
            Sqoot Pure Customer Care Messaging Program
          </h3>
          <p className="body-copy mt-5 text-charcoal/90">
            By providing your phone number on this Platform, you consent to receive text messages from Sqoot Pure for customer care purposes, including: order confirmations and status updates, shipping and delivery notifications, KYC verification updates, payment receipts and transaction alerts, customer support responses.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Message frequency varies based on your account activity and support interactions. Message and data rates may apply depending on your carrier and plan.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            To opt out: Reply STOP to any message to unsubscribe from all text communications. You will receive a one-time confirmation message.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            For help: Reply HELP to any message, or contact us at +1 (254) 455-5959, +1 (920) 776-6863, or through our contact form.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Consent to receive text messages is not a condition of purchase. Carriers are not liable for delayed or undelivered messages. We do not share your phone number with third parties for their marketing purposes.
          </p>

          <h2 id="prohibited-uses" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            9. Prohibited Uses
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            You agree not to use the Platform for any unlawful purpose, including money laundering, fraud, or circumventing regulatory requirements. We reserve the right to suspend or terminate any account that violates these Terms or applicable law.
          </p>

          <h2 id="intellectual-property" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            10. Intellectual Property
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            All content on getsqoot.com, including text, graphics, logos, and software, is the property of Fortress Gold Inc. DBA Sqoot and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.
          </p>

          <h2 id="limitation-of-liability" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            11. Limitation of Liability
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            To the maximum extent permitted by law, Sqoot Pure shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount you paid to us in the twelve months preceding the claim.
          </p>

          <h2 id="disclaimer-of-warranties" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            12. Disclaimer of Warranties
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            The Platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee that the Platform will be uninterrupted, error-free, or secure at all times.
          </p>

          <h2 id="governing-law" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            13. Governing Law
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            These Terms are governed by the laws of the State of Wyoming. Any disputes arising from these Terms shall be resolved in the state or federal courts located in Wyoming.
          </p>

          <h2 id="changes-to-these-terms" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            14. Changes to These Terms
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            We may update these Terms from time to time. Changes will be posted on this page with an updated revision date. Continued use of the Platform after changes constitutes acceptance of the revised Terms.
          </p>

          <h2 id="commodity-risk-and-market-movement" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            15. Commodity Risk and Market Movement
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold prices fluctuate continuously. SQOOT Pure does not guarantee that your gold will increase in value or that a redemption will return the same amount you paid. You are responsible for reviewing the live price, fees, and transaction details before confirming any purchase or redemption.
          </p>

          <h2 id="refund-policy-all-sales-final" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            16. Refund Policy — All Sales Final
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            All gold purchases on SQOOT Pure are final and non-refundable. By confirming a transaction, you acknowledge that no cash refund will be issued to your original payment method for any reason, including changes in gold market value after your purchase is confirmed.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            <strong>Why sales are final:</strong> Gold is a physical commodity. Once your purchase is confirmed, your gold is physically allocated to your vault in your name at the live spot price at the moment of confirmation. Market prices change in real time, and the purchase price is locked at confirmation. We cannot reverse a physically settled commodity transaction.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            <strong>Want to exit your position? Redeem your gold.</strong>
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            On SQOOT Pure, &quot;redeem&quot; is the customer exit process. It may mean receiving an ACH cash payout for your gold at the current live spot price, less disclosed fees, or requesting insured physical delivery when available. We do not treat &quot;redeem&quot; and &quot;buyback&quot; as separate customer actions.
          </p>
          <h3 className="font-display mt-8 text-xl font-medium leading-[1.15] tracking-[-0.01em] text-forest-deep sm:text-2xl">
            How cash redemption works:
          </h3>
          <ol className="body-copy mt-5 list-decimal space-y-3 pl-6 text-charcoal/90">
            <li>Submit a redemption request from your account dashboard or by contacting hello@sqoot.us.</li>
            <li>Your gold is valued at the live spot price when the request is processed, not the price you originally paid.</li>
            <li>Applicable platform and processing fees are disclosed before you confirm.</li>
            <li>Net proceeds are returned via ACH to your verified bank account, typically within 3 to 5 business days after approval.</li>
          </ol>
          <p className="body-copy mt-5 text-charcoal/90">
            Your redemption price will reflect current market conditions. SQOOT Pure does not guarantee that the redemption value will equal or exceed your original purchase price.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            <strong>Platform Errors:</strong> If a verified technical error by SQOOT Pure results in a duplicate charge or incorrect transaction amount, we will investigate and issue a correction within 5 business days. Contact hello@sqoot.us with your transaction ID and a description of the issue.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            <strong>In plain language:</strong> You bought gold. It is yours. Its value moves with the market. If you want to exit, you redeem your gold at today&apos;s market price, less disclosed fees. That is your exit path.
          </p>

          <h2 id="contact-us" className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            17. Contact Us
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            If you have questions about these Terms, please contact us through our contact form on getsqoot.com or call +1 (254) 455-5959 or +1 (920) 776-6863.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Fortress Gold Inc. DBA Sqoot<br />
            Wyoming Corporation · Headquarters: Houston, TX<br />
            Website: getsqoot.com
          </p>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
