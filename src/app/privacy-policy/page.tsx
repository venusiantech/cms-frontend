import LegalLayout from '@/components/legal/LegalLayout';

const SECTIONS = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    content: (
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold text-white mb-2">1.1 Personal Information</h3>
          <p className="mb-3">We may collect:</p>
          <ul className="space-y-1.5 list-none">
            {[
              'Full name',
              'Email address',
              'Company name',
              'Billing address',
              'Payment details (processed securely via Stripe)',
              'Account login credentials',
              'Domain names connected to our platform',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-2">1.2 Automatically Collected Data</h3>
          <p className="mb-3">Through cookies and analytics tools, we collect:</p>
          <ul className="space-y-1.5 list-none">
            {[
              'IP address',
              'Device information',
              'Browser type',
              'Location (approximate)',
              'Pages visited',
              'Session duration',
              'Referring website',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white mb-2">1.3 Content Data</h3>
          <p className="mb-3">When using Fastofy:</p>
          <ul className="space-y-1.5 list-none">
            {[
              'Blog content generated',
              'Keywords submitted',
              'Website configuration',
              'Uploaded media',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3">Content inputs may be processed by AI providers listed below.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'how-we-use-data',
    title: '2. How We Use Your Information',
    content: (
      <div>
        <p className="mb-3">We use your data to:</p>
        <ul className="space-y-1.5 list-none">
          {[
            'Provide AI website and blog generation services',
            'Process subscription payments',
            'Improve platform performance',
            'Provide customer support',
            'Detect fraud or abuse',
            'Comply with legal obligations',
            'Enable monetization tools (e.g., Amazon Associates)',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'third-party-providers',
    title: '3. Third-Party Service Providers',
    content: (
      <div className="space-y-4">
        <p>We use trusted third-party providers to operate Fastofy:</p>
        {[
          {
            name: 'Stripe (Payment Processing)',
            points: [
              'Processes billing information securely',
              'We do NOT store full card details',
              'Subject to Stripe Privacy Policy',
            ],
          },
          {
            name: 'Google Analytics',
            points: [
              'Tracks website usage and behavior',
              'May use cookies',
              'Data may be transferred outside your country',
            ],
          },
          {
            name: 'Amazon Associates',
            points: [
              'If enabled by users, affiliate links may use tracking cookies',
              "Subject to Amazon's privacy policies",
            ],
          },
          {
            name: 'OpenAI & Google Gemini',
            points: [
              'Used for AI content generation',
              'User content may be processed through secure API requests',
              'We do not use your content to train models beyond provider policies',
              'Subject to OpenAI and Google privacy policies',
            ],
          },
        ].map((provider) => (
          <div key={provider.name} className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-4">
            <h3 className="font-semibold text-white mb-2">{provider.name}</h3>
            <ul className="space-y-1.5 list-none">
              {provider.points.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'international-transfers',
    title: '4. International Data Transfers',
    content: (
      <div>
        <p className="mb-3">Because we operate globally:</p>
        <ul className="space-y-1.5 list-none">
          {[
            'Your data may be processed in UAE, EU, USA, or other jurisdictions',
            'By using Fastofy, you consent to cross-border data transfers',
            'We rely on standard contractual safeguards where required',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'cookies',
    title: '5. Cookies & Tracking Technologies',
    content: (
      <div>
        <p className="mb-3">We use cookies to:</p>
        <ul className="space-y-1.5 list-none mb-4">
          {[
            'Maintain login sessions',
            'Analyze traffic',
            'Improve performance',
            'Enable monetization features',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p>Users in the EU may see a cookie consent banner. You can disable cookies via browser settings.</p>
      </div>
    ),
  },
  {
    id: 'data-retention',
    title: '6. Data Retention',
    content: (
      <div>
        <p className="mb-3">We retain personal data:</p>
        <ul className="space-y-1.5 list-none mb-4">
          {[
            'While your account is active',
            'As required for legal and tax compliance',
            'For fraud prevention and security',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p>You may request account deletion at any time.</p>
      </div>
    ),
  },
  {
    id: 'user-rights',
    title: '7. User Rights (GDPR & International Users)',
    content: (
      <div>
        <p className="mb-3">If you are in the EU or certain jurisdictions, you may have the right to:</p>
        <ul className="space-y-1.5 list-none mb-4">
          {[
            'Access your data',
            'Correct inaccurate data',
            'Request deletion',
            'Restrict processing',
            'Object to processing',
            'Request data portability',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-[rgba(218,255,1,0.2)] bg-[rgba(218,255,1,0.05)] p-4">
          <p>To exercise these rights, contact:</p>
          <p className="mt-2 font-medium text-[rgb(218,255,1)]">
            📧{' '}
            <a href="mailto:support@fastofy.com" className="underline underline-offset-2">
              support@fastofy.com
            </a>
          </p>
          <p className="mt-1 text-sm text-[rgb(161,161,170)]">We will respond within 30 days.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'ccpa',
    title: '8. California Privacy Rights (CCPA)',
    content: (
      <div>
        <p className="mb-3">California residents may request:</p>
        <ul className="space-y-1.5 list-none mb-4">
          {[
            'Disclosure of collected data',
            'Deletion of personal information',
            'Confirmation that we do not sell personal data',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="inline-flex items-center gap-2 rounded-lg bg-[rgba(218,255,1,0.1)] border border-[rgba(218,255,1,0.3)] px-4 py-2">
          <span className="text-[rgb(218,255,1)] font-semibold">Fastofy does NOT sell user data.</span>
        </div>
      </div>
    ),
  },
  {
    id: 'data-security',
    title: '9. Data Security',
    content: (
      <div>
        <p className="mb-3">We implement:</p>
        <ul className="space-y-1.5 list-none mb-4">
          {[
            'HTTPS encryption',
            'Secure API connections',
            'Access control policies',
            'Payment tokenization via Stripe',
            'Ongoing monitoring',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-[rgb(161,161,170)]">However, no system is 100% secure.</p>
      </div>
    ),
  },
  {
    id: 'user-responsibility',
    title: '10. User Responsibility',
    content: (
      <div>
        <p className="mb-3">Users are responsible for:</p>
        <ul className="space-y-1.5 list-none">
          {[
            'Reviewing AI-generated content',
            'Ensuring compliance with advertising laws',
            'Complying with Amazon Associate and AdSense rules',
            'Not generating illegal or copyrighted content',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'childrens-privacy',
    title: "11. Children's Privacy",
    content: (
      <div className="space-y-2">
        <p>Fastofy is not intended for individuals under 18 years old.</p>
        <p>We do not knowingly collect data from minors.</p>
      </div>
    ),
  },
  {
    id: 'account-suspension',
    title: '12. Account Suspension',
    content: (
      <div>
        <p className="mb-3">We may suspend accounts for:</p>
        <ul className="space-y-1.5 list-none">
          {[
            'Spam',
            'Copyright violations',
            'Fraud',
            'Illegal content',
            'Abuse of AI systems',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'policy-changes',
    title: '13. Changes to This Policy',
    content: (
      <div className="space-y-2">
        <p>We may update this policy periodically.</p>
        <p>Changes will be posted with a new "Last Updated" date.</p>
      </div>
    ),
  },
  {
    id: 'contact',
    title: '14. Contact Information',
    content: (
      <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-5 space-y-1">
        <p className="font-semibold text-white text-lg">Fastofy</p>
        <p>Venusian LLC</p>
        <p>Registered in the United Arab Emirates</p>
        <a
          href="mailto:support@fastofy.com"
          className="inline-flex items-center gap-2 mt-2 text-[rgb(218,255,1)] font-medium hover:underline"
        >
          📧 support@fastofy.com
        </a>
      </div>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      effectiveDate="1st January 2026"
      lastUpdated="27th February 2026"
      intro={
        <div className="space-y-3">
          <p>
            <strong className="text-white">Fastofy.com</strong> ("Fastofy", "we", "our", or "us") is operated by{' '}
            <strong className="text-white">Venusian LLC</strong>, a company registered in the United Arab Emirates (UAE).
          </p>
          <p>
            We are committed to protecting your privacy and complying with applicable international data protection laws,
            including:
          </p>
          <ul className="space-y-1 list-none">
            {['UAE Data Protection Law', 'GDPR (EU users)', 'CCPA/CPRA (California users, where applicable)'].map(
              (law) => (
                <li key={law} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
                  {law}
                </li>
              ),
            )}
          </ul>
          <p className="text-sm text-[rgb(161,161,170)]">By using Fastofy.com, you agree to this Privacy Policy.</p>
        </div>
      }
      sections={SECTIONS}
    />
  );
}
