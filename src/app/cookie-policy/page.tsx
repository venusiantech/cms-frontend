import LegalLayout from '@/components/legal/LegalLayout';

const COOKIE_TYPES = [
  {
    name: 'Essential Cookies',
    color: 'bg-[rgba(218,255,1,0.08)] border-[rgba(218,255,1,0.2)]',
    badge: 'text-[rgb(218,255,1)]',
    required: true,
    items: ['Login authentication', 'Security', 'Session management'],
    desc: 'These cookies are strictly necessary for the platform to function. They cannot be disabled.',
  },
  {
    name: 'Analytics Cookies',
    color: 'bg-[rgba(100,180,255,0.06)] border-[rgba(100,180,255,0.2)]',
    badge: 'text-[rgb(100,180,255)]',
    required: false,
    items: ['Google Analytics', 'Usage tracking', 'Performance improvement'],
    desc: 'Help us understand how visitors interact with our platform so we can improve it.',
  },
  {
    name: 'Marketing & Affiliate Cookies',
    color: 'bg-[rgba(255,165,80,0.06)] border-[rgba(255,165,80,0.2)]',
    badge: 'text-[rgb(255,165,80)]',
    required: false,
    items: ['Amazon Associates tracking', 'Advertising platform cookies'],
    desc: 'Used for affiliate tracking and advertising when those features are enabled.',
  },
];

const SECTIONS = [
  {
    id: 'what-are-cookies',
    title: '1. What Are Cookies?',
    content: (
      <p>
        Cookies are small data files stored on your device when you visit our website. They help us remember your
        preferences, keep you logged in, and understand how our platform is used — allowing us to improve your
        experience over time.
      </p>
    ),
  },
  {
    id: 'cookie-types',
    title: '2. Types of Cookies We Use',
    content: (
      <div className="space-y-4">
        {COOKIE_TYPES.map((type) => (
          <div key={type.name} className={`rounded-xl border p-5 ${type.color}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`font-semibold text-white`}>{type.name}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${type.badge} border-current`}>
                {type.required ? 'Always Active' : 'Optional'}
              </span>
            </div>
            <p className="text-sm text-[rgb(161,161,170)] mb-3">{type.desc}</p>
            <ul className="space-y-1.5 list-none">
              {type.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-[rgb(218,218,218)]">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 opacity-60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'managing-cookies',
    title: '3. Managing Cookies',
    content: (
      <div className="space-y-4">
        <p>Users may control cookies in the following ways:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-4">
            <p className="font-semibold text-white mb-2">Browser Settings</p>
            <p className="text-sm text-[rgb(161,161,170)]">
              Most browsers allow you to view, manage, block, and delete cookies through their privacy or security
              settings.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-4">
            <p className="font-semibold text-white mb-2">EU Consent</p>
            <p className="text-sm text-[rgb(161,161,170)]">
              EU/EEA residents may withdraw cookie consent at any time. A cookie banner is shown on first visit to
              manage preferences.
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] px-4 py-3 text-sm text-[rgb(161,161,170)]">
          ⚠️ Note: Disabling essential cookies may affect platform functionality including login and session management.
        </div>
      </div>
    ),
  },
  {
    id: 'third-party-cookies',
    title: '4. Third-Party Cookies',
    content: (
      <div className="space-y-3">
        <p>
          Third-party services integrated with Fastofy may place their own cookies on your device. These are governed
          by the respective third-party privacy policies:
        </p>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[rgba(255,255,255,0.03)]">
                <th className="text-left px-4 py-3 font-semibold text-white">Provider</th>
                <th className="text-left px-4 py-3 font-semibold text-white">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['Google', 'Analytics & advertising'],
                ['Amazon', 'Affiliate tracking'],
                ['Stripe', 'Payment processing'],
              ].map(([provider, purpose]) => (
                <tr key={provider} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="px-4 py-3 text-[rgb(218,218,218)]">{provider}</td>
                  <td className="px-4 py-3 text-[rgb(161,161,170)]">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[rgb(161,161,170)]">
          Fastofy is not responsible for the cookie practices of third-party providers. Please review their
          respective privacy policies for details.
        </p>
      </div>
    ),
  },
  {
    id: 'contact',
    title: '5. Contact',
    content: (
      <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-5 space-y-1">
        <p className="font-semibold text-white text-lg">Fastofy</p>
        <p>Venusian LLC — United Arab Emirates</p>
        <a href="mailto:app@fastofy.com" className="inline-flex items-center gap-2 mt-2 text-[rgb(218,255,1)] font-medium hover:underline">
          📧 app@fastofy.com
        </a>
      </div>
    ),
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      effectiveDate="1st January 2026"
      lastUpdated="1st January 2026"
      intro={
        <div className="space-y-2">
          <p>
            <strong className="text-white">Fastofy.com</strong> uses cookies and similar tracking technologies to
            improve user experience, analyze usage, and enable certain platform features.
          </p>
          <p className="text-sm text-[rgb(161,161,170)]">
            This policy explains what cookies we use, why we use them, and how you can manage your preferences.
            For more detail on how we handle your personal data, see our{' '}
            <a href="/privacy-policy" className="text-[rgb(218,255,1)] hover:underline">Privacy Policy</a>.
          </p>
        </div>
      }
      sections={SECTIONS}
    />
  );
}
