export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-40"
        style={{
          background: "rgba(250, 250, 248, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="max-w-[1080px] mx-auto px-5 h-14 flex items-center">
          <a
            href="/"
            className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to findmydiamond
          </a>
        </div>
      </nav>

      <main className="max-w-[600px] mx-auto px-5 pt-10 pb-16">
        <h1
          className="text-2xl font-bold mb-8"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
          }}
        >
          Terms &amp; Conditions
        </h1>

        <div
          className="space-y-5 text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            1. Business Identity
          </h2>
          <p>
            Trading name: <strong>FindMyDiamond</strong>. Contact:{" "}
            <a
              href="mailto:legal@findmydiamond.co.uk"
              className="underline"
              style={{ color: "var(--text-primary)" }}
            >
              legal@findmydiamond.co.uk
            </a>
            . FindMyDiamond is an independent diamond price comparison tool (Electronic Commerce Regulations 2002, reg. 6).
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            2. Service Description
          </h2>
          <p>
            FindMyDiamond is an independent diamond price comparison tool. We are
            not a retailer and no purchases are made on this site.
          </p>
          <p>
            We aggregate diamond listings from third-party retailers to help you
            compare prices and find the best value.
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            3. Affiliate Disclosure
          </h2>
          <p>
            We may earn a commission when you click through to a retailer and
            complete a purchase. This does not affect the price you pay.
            (Consumer Protection from Unfair Trading Regulations 2008.)
          </p>
          <p>
            Listings marked &quot;Ad&quot; contain affiliate links. Our comparison
            results are not influenced by commission rates.
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            4. Price Accuracy
          </h2>
          <p>
            Prices displayed are sourced from third-party data feeds and are
            updated regularly. However, we cannot guarantee that prices are
            accurate at the time you view them.
          </p>
          <p>
            Prices may differ on the retailer&apos;s website at the time of
            purchase. All prices are displayed in GBP, converted from source
            currencies using regularly updated exchange rates. Minor discrepancies
            may occur due to exchange rate fluctuations.
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            5. Fair Price Estimate Disclaimer
          </h2>
          <p>
            The &quot;fair price&quot; shown on this site is a statistical estimate
            based on current market data. It is calculated using the median price
            of comparable diamonds in our database.
          </p>
          <p>
            It is not a professional valuation, appraisal, or financial advice. It
            should not be solely relied upon when making purchase decisions. We
            recommend consulting with a qualified gemologist or jeweller for
            professional valuations.
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            6. Grading Lab Information
          </h2>
          <p>
            Diamond grading standards and consistency vary between certification
            laboratories. The trust indicators displayed alongside grading lab
            names are informational, based on widely held industry views, and do
            not constitute endorsements or guarantees of grading accuracy.
          </p>
          <p>
            We recommend researching the grading standards of any certification
            laboratory before making a purchase.
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            7. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by applicable law, FindMyDiamond shall
            not be liable for any loss or damage arising from: disputes with
            retailers, delivery issues, product quality, or pricing errors
            originating from third-party data feeds. (Consumer Rights Act 2015,
            Unfair Contract Terms Act 1977.)
          </p>
          <p>
            Nothing in these terms excludes or limits our liability for fraud, or
            for death or personal injury caused by our negligence.
          </p>
          <p>
            Our total liability to you for any claim arising from your use of this
            site shall not exceed the amount you have paid to us (which, as a free
            service, is nil).
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            8. Intellectual Property
          </h2>
          <p>
            All content, design, branding, and algorithms on this site are the
            property of FindMyDiamond. You may not scrape, reproduce, or
            redistribute data from this site without prior written consent.
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            9. Governing Law and Jurisdiction
          </h2>
          <p>
            These terms are governed by and construed in accordance with the laws
            of England and Wales. The courts of England and Wales shall have
            exclusive jurisdiction over any dispute arising from these terms or
            your use of this site.
          </p>

          <p
            className="text-xs pt-6 pb-4"
            style={{ color: "var(--text-light)" }}
          >
            Last updated: March 2026
          </p>
        </div>
      </main>
    </div>
  );
}
