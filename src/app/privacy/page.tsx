export default function PrivacyPage() {
  return (
    <main className="min-h-screen pb-16">
      <div className="max-w-[600px] mx-auto px-5 pt-12">
        <a href="/" className="text-sm text-gray-500 hover:text-gray-900">
          &larr; Back to findmydiamond
        </a>
        <h1 className="text-2xl font-bold mt-6 mb-6">Privacy Policy</h1>

        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            <strong>findmydiamond</strong> (&quot;we&quot;, &quot;us&quot;) is
            committed to protecting your privacy. This policy explains how we
            collect, use, and protect your personal data.
          </p>

          <h2 className="text-base font-semibold pt-2">What we collect</h2>
          <p>
            When you sign up for price alerts, we collect your email address and
            the diamond specifications you searched for (carat, cut, colour,
            clarity). We do not collect your name, address, or payment
            information.
          </p>

          <h2 className="text-base font-semibold pt-2">How we use your data</h2>
          <p>
            We use your email address solely to send you price alert
            notifications for the diamond specifications you requested. We will
            never sell, rent, or share your email address with third parties.
          </p>

          <h2 className="text-base font-semibold pt-2">Analytics</h2>
          <p>
            We may use privacy-focused analytics to understand how visitors use
            our site. This data is aggregated and does not identify you
            personally.
          </p>

          <h2 className="text-base font-semibold pt-2">Your rights</h2>
          <p>Under GDPR, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Request a copy of the data we hold about you</li>
            <li>Request deletion of your data</li>
            <li>Unsubscribe from emails at any time</li>
          </ul>
          <p>
            To exercise these rights, email us and we will action your request
            within 30 days.
          </p>

          <h2 className="text-base font-semibold pt-2">Data retention</h2>
          <p>
            We retain your email and search preferences until you request
            deletion or unsubscribe. We will delete your data within 30 days of
            your request.
          </p>

          <h2 className="text-base font-semibold pt-2">Cookies</h2>
          <p>
            This site uses only essential cookies required for the site to
            function. We do not use tracking cookies.
          </p>

          <p className="text-xs text-gray-400 pt-4">
            Last updated: March 2026
          </p>
        </div>
      </div>
    </main>
  );
}
