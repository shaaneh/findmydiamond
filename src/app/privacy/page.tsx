export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <div
          className="space-y-5 text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          <p>
            <strong>findmydiamond</strong> (&quot;we&quot;, &quot;us&quot;) is
            committed to protecting your privacy. This policy explains how we
            collect, use, and protect your personal data in accordance with the
            UK General Data Protection Regulation (UK GDPR) and the Data
            Protection Act 2018.
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            What we collect
          </h2>
          <p>
            When you sign up for price alerts, we collect your email address and
            the diamond specifications you searched for (carat, cut, colour,
            clarity). We do not collect your name, address, or payment
            information.
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            How we use your data
          </h2>
          <p>
            We use your email address solely to send you price alert
            notifications for the diamond specifications you requested. We will
            never sell, rent, or share your email address with third parties.
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            Legal basis
          </h2>
          <p>
            We process your data based on your explicit consent (Article 6(1)(a)
            UK GDPR), which you provide by ticking the consent checkbox when
            signing up for alerts.
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            Analytics
          </h2>
          <p>
            We may use privacy-focused analytics to understand how visitors use
            our site. This data is aggregated and does not identify you
            personally.
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            Your rights
          </h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Rectify inaccurate personal data</li>
            <li>Request erasure of your personal data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p>
            To exercise these rights, email{" "}
            <a
              href="mailto:privacy@findmydiamond.co.uk"
              className="underline"
              style={{ color: "var(--text-primary)" }}
            >
              privacy@findmydiamond.co.uk
            </a>{" "}
            and we will action your request within 30 days.
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            Data retention
          </h2>
          <p>
            We retain your email and search preferences until you request
            deletion or unsubscribe. We will delete your data within 30 days of
            your request.
          </p>

          <h2
            className="text-base font-semibold pt-2"
            style={{ color: "var(--text-primary)" }}
          >
            Cookies
          </h2>
          <p>
            This site uses only essential cookies required for the site to
            function. We do not use tracking cookies or third-party advertising
            cookies.
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
