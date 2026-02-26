import LegalLayout from '@/components/legal/LegalLayout';

const SECTIONS = [
  {
    id: 'description',
    title: '1. Description of Services',
    content: (
      <div className="space-y-3">
        <p>Fastofy is an AI-powered SaaS platform that allows users to:</p>
        <ul className="space-y-2 list-none">
          {[
            'Generate websites and blogs',
            'Automatically create AI-based content',
            'Insert stock images',
            'Integrate monetization tools (e.g., Amazon Associates, Google AdSense)',
            'Manage domain-based publishing',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-[rgb(161,161,170)]">
          We reserve the right to modify or discontinue services at any time.
        </p>
      </div>
    ),
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    content: (
      <div className="space-y-3">
        <p>You must be at least 18 years old to use Fastofy.</p>
        <p>By using our services, you confirm that:</p>
        <ul className="space-y-2 list-none">
          {[
            'You have legal capacity to enter contracts',
            'You will comply with applicable laws',
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
    id: 'user-accounts',
    title: '3. User Accounts',
    content: (
      <div className="space-y-3">
        <p>You agree to:</p>
        <ul className="space-y-2 list-none">
          {[
            'Provide accurate information',
            'Maintain account confidentiality',
            'Be responsible for all activities under your account',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p>We may suspend accounts for violations.</p>
      </div>
    ),
  },
  {
    id: 'ai-disclaimer',
    title: '4. AI-Generated Content Disclaimer',
    content: (
      <div className="space-y-3">
        <p>Fastofy uses third-party AI providers (OpenAI, Google Gemini).</p>
        <p>You acknowledge:</p>
        <ul className="space-y-2 list-none">
          {[
            'AI-generated content may contain inaccuracies',
            'You are responsible for reviewing all content before publishing',
            'We do not guarantee SEO ranking or monetization results',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] px-4 py-3 text-sm text-[rgb(161,161,170)]">
          Fastofy is a content automation tool, not a legal or financial advisor.
        </div>
      </div>
    ),
  },
  {
    id: 'acceptable-use',
    title: '5. Acceptable Use Policy',
    content: (
      <div className="space-y-3">
        <p>You agree <strong className="text-white">NOT</strong> to:</p>
        <ul className="space-y-2 list-none">
          {[
            'Generate illegal content',
            'Violate copyright laws',
            'Produce hate speech, adult, or harmful material',
            'Engage in spam or malicious SEO',
            'Abuse AI systems',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(255,120,120)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-[rgb(161,161,170)]">Violation may result in immediate termination.</p>
      </div>
    ),
  },
  {
    id: 'payments',
    title: '6. Payments & Subscriptions',
    content: (
      <div className="space-y-3">
        <p>Payments are processed securely via Stripe.</p>
        <ul className="space-y-2 list-none">
          {[
            'Subscriptions may auto-renew unless canceled',
            'You are responsible for applicable taxes',
            'We may change pricing with prior notice',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] px-4 py-3 text-sm text-[rgb(161,161,170)]">
          No guarantee of earnings from monetization tools.
        </div>
      </div>
    ),
  },
  {
    id: 'intellectual-property',
    title: '7. Intellectual Property',
    content: (
      <div className="space-y-4">
        <p>You retain ownership of content generated under your account.</p>
        <div>
          <p className="mb-2">Fastofy retains ownership of:</p>
          <ul className="space-y-2 list-none">
            {[
              'Software',
              'Branding',
              'Platform code',
              'Proprietary systems',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p>You may not copy or resell the Fastofy platform.</p>
      </div>
    ),
  },
  {
    id: 'third-party',
    title: '8. Third-Party Integrations',
    content: (
      <div className="space-y-3">
        <p>Fastofy integrates with:</p>
        <div className="flex flex-wrap gap-2">
          {['Stripe', 'Google Analytics', 'Amazon Associates', 'OpenAI', 'Google Gemini'].map((name) => (
            <span
              key={name}
              className="px-3 py-1 rounded-lg border border-white/10 bg-[rgba(255,255,255,0.03)] text-sm text-[rgb(218,218,218)]"
            >
              {name}
            </span>
          ))}
        </div>
        <p>We are not responsible for third-party platform policies or actions.</p>
      </div>
    ),
  },
  {
    id: 'liability',
    title: '9. Limitation of Liability',
    content: (
      <div className="space-y-3">
        <p>To the maximum extent permitted by law, Fastofy shall not be liable for:</p>
        <ul className="space-y-2 list-none">
          {[
            'Lost profits',
            'SEO ranking losses',
            'Revenue losses',
            'Third-party platform bans',
            'Content inaccuracies',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] px-4 py-3 text-sm text-[rgb(161,161,170)]">
          Use the platform at your own risk.
        </div>
      </div>
    ),
  },
  {
    id: 'termination',
    title: '10. Termination',
    content: (
      <div className="space-y-3">
        <p>We may suspend or terminate accounts for:</p>
        <ul className="space-y-2 list-none">
          {[
            'Policy violations',
            'Fraud',
            'Abuse',
            'Non-payment',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p>Users may cancel subscriptions at any time.</p>
      </div>
    ),
  },
  {
    id: 'governing-law',
    title: '11. Governing Law',
    content: (
      <div className="space-y-2">
        <p>These Terms are governed by the laws of the United Arab Emirates.</p>
        <p>
          Disputes shall be resolved in UAE jurisdiction unless otherwise required by international law.
        </p>
      </div>
    ),
  },
  {
    id: 'contact',
    title: '12. Contact',
    content: (
      <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-5 space-y-1">
        <p className="font-semibold text-white text-lg">Fastofy</p>
        <p>Venusian LLC</p>
        <p>United Arab Emirates</p>
        <a
          href="mailto:app@fastofy.com"
          className="inline-flex items-center gap-2 mt-2 text-[rgb(218,255,1)] font-medium hover:underline"
        >
          📧 app@fastofy.com
        </a>
      </div>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      effectiveDate="1st January 2026"
      lastUpdated="27th February 2026"
      intro={
        <div className="space-y-3">
          <p>
            Welcome to <strong className="text-white">Fastofy.com</strong> ("Fastofy", "Company", "we", "our", or
            "us"), operated by <strong className="text-white">Venusian LLC</strong>, registered in the United Arab
            Emirates.
          </p>
          <p>By accessing or using Fastofy, you agree to these Terms of Service.</p>
          <p className="text-sm text-[rgb(161,161,170)]">
            Please read these Terms carefully. If you do not agree, please do not use our platform.
          </p>
        </div>
      }
      sections={SECTIONS}
    />
  );
}
