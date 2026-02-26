import LegalLayout from '@/components/legal/LegalLayout';

const SECTIONS = [
  {
    id: 'definitions',
    title: '1. Definitions',
    content: (
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[rgba(255,255,255,0.03)]">
              <th className="text-left px-4 py-3 font-semibold text-white w-1/3">Term</th>
              <th className="text-left px-4 py-3 font-semibold text-white">Definition</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[
              ['Controller', 'The entity (Fastofy user/customer) that determines the purposes and means of processing personal data.'],
              ['Processor', 'Fastofy (Venusian LLC), processing personal data on behalf of the Controller.'],
              ['Personal Data', 'Any information relating to an identified or identifiable individual.'],
              ['Sub-processor', 'A third-party service provider engaged by Fastofy to assist in processing personal data.'],
            ].map(([term, def]) => (
              <tr key={term} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <td className="px-4 py-3 font-medium text-[rgb(218,255,1)]">{term}</td>
                <td className="px-4 py-3 text-[rgb(161,161,170)]">{def}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    id: 'scope',
    title: '2. Scope of Processing',
    content: (
      <div className="space-y-3">
        <p>Fastofy processes personal data solely to:</p>
        <ul className="space-y-2 list-none">
          {[
            'Provide AI content generation services',
            'Host websites and blogs',
            'Process subscriptions',
            'Provide analytics and system functionality',
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
    id: 'data-types',
    title: '3. Types of Personal Data Processed',
    content: (
      <div className="space-y-3">
        <p>Personal data processed under this DPA may include:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Name',
            'Email address',
            'Billing information',
            'IP address',
            'Website visitor analytics',
            'User-generated content',
          ].map((item) => (
            <span key={item} className="px-3 py-1.5 rounded-lg border border-white/10 bg-[rgba(255,255,255,0.03)] text-sm text-[rgb(218,218,218)]">
              {item}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'processing-activities',
    title: '4. Nature & Purpose of Processing',
    content: (
      <div className="space-y-3">
        <p>Processing activities include:</p>
        <ul className="space-y-2 list-none">
          {[
            'Storing website data',
            'AI content generation via API',
            'Analytics tracking',
            'Payment processing',
            'Account management',
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
    id: 'sub-processors',
    title: '5. Sub-Processors',
    content: (
      <div className="space-y-4">
        <p>Fastofy engages the following sub-processors. All are bound by data protection obligations.</p>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[rgba(255,255,255,0.03)]">
                <th className="text-left px-4 py-3 font-semibold text-white">Sub-Processor</th>
                <th className="text-left px-4 py-3 font-semibold text-white">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['Stripe', 'Payment processing'],
                ['OpenAI', 'AI content generation'],
                ['Google Gemini', 'AI content generation'],
                ['Google Analytics', 'Usage analytics'],
                ['Hosting providers', 'Infrastructure & storage'],
                ['Amazon Associates', 'Affiliate tracking (if enabled)'],
              ].map(([name, purpose]) => (
                <tr key={name} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="px-4 py-3 font-medium text-[rgb(218,218,218)]">{name}</td>
                  <td className="px-4 py-3 text-[rgb(161,161,170)]">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[rgb(161,161,170)]">
          Fastofy may update the list of sub-processors as needed. Users will be notified of material changes.
        </p>
      </div>
    ),
  },
  {
    id: 'international-transfers',
    title: '6. International Data Transfers',
    content: (
      <div className="space-y-3">
        <p>Data may be transferred outside the EU/EEA. Fastofy ensures:</p>
        <ul className="space-y-2 list-none">
          {[
            'Adequate safeguards via Standard Contractual Clauses (SCCs)',
            'Contractual protections with all sub-processors',
            'Secure API transmission',
            'Encryption in transit',
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
    id: 'security',
    title: '7. Security Measures',
    content: (
      <div className="space-y-3">
        <p>Fastofy implements the following technical and organizational security measures:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '🔒', label: 'HTTPS encryption' },
            { icon: '🛡️', label: 'Access controls' },
            { icon: '🔌', label: 'Secure API architecture' },
            { icon: '🔑', label: 'Token-based authentication' },
            { icon: '💳', label: 'Payment tokenization via Stripe' },
            { icon: '📡', label: 'Encryption in transit' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-lg border border-white/10 bg-[rgba(255,255,255,0.02)] px-4 py-2.5">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm text-[rgb(218,218,218)]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'confidentiality',
    title: '8. Confidentiality',
    content: (
      <p>
        All Fastofy personnel with access to personal data are bound by confidentiality obligations. Access to
        personal data is restricted on a need-to-know basis.
      </p>
    ),
  },
  {
    id: 'data-subject-rights',
    title: '9. Data Subject Rights Assistance',
    content: (
      <div className="space-y-3">
        <p>Fastofy will assist Controllers in responding to data subject requests, including:</p>
        <ul className="space-y-2 list-none">
          {[
            'Access requests',
            'Deletion requests',
            'Correction requests',
            'Data portability requests',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-[rgba(218,255,1,0.2)] bg-[rgba(218,255,1,0.05)] p-4">
          <p className="mb-1">Requests must be submitted via:</p>
          <a href="mailto:support@fastofy.com" className="text-[rgb(218,255,1)] font-medium hover:underline">
            📧 support@fastofy.com
          </a>
        </div>
      </div>
    ),
  },
  {
    id: 'breach-notification',
    title: '10. Data Breach Notification',
    content: (
      <div className="space-y-3">
        <p>In the event of a data breach affecting personal data, Fastofy will:</p>
        <ul className="space-y-2 list-none">
          {[
            'Notify affected customers without undue delay',
            'Provide relevant information about the nature and scope of the breach',
            'Cooperate in mitigation and remediation efforts',
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
    id: 'retention-deletion',
    title: '11. Data Retention & Deletion',
    content: (
      <div className="space-y-2">
        <p>Upon termination of services:</p>
        <ul className="space-y-2 list-none">
          {[
            'Users may request deletion of personal data',
            'Data may be retained where legally required',
            'Backups may persist temporarily per security policies',
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
    id: 'liability',
    title: '12. Liability',
    content: (
      <div className="space-y-2">
        <p>Liability is governed by Fastofy's Terms of Service.</p>
        <p>
          Fastofy's total liability under this DPA shall not exceed the total subscription fees paid by the
          Controller in the preceding 12 months.
        </p>
      </div>
    ),
  },
  {
    id: 'governing-law',
    title: '13. Governing Law',
    content: (
      <div className="space-y-2">
        <p>This DPA is governed by the laws of the United Arab Emirates.</p>
        <p>Where mandatory GDPR provisions apply to EU data subjects, those provisions shall take precedence.</p>
      </div>
    ),
  },
];

export default function DpaPage() {
  return (
    <LegalLayout
      title="Data Processing Agreement"
      effectiveDate="1st January 2026"
      lastUpdated="1st January 2026"
      intro={
        <div className="space-y-3">
          <p>
            This Data Processing Agreement ("DPA") forms part of the Terms of Service between:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-4">
              <p className="text-xs font-semibold text-[rgb(218,255,1)] uppercase tracking-widest mb-1">Processor</p>
              <p className="font-semibold text-white">Venusian LLC</p>
              <p className="text-sm text-[rgb(161,161,170)]">United Arab Emirates</p>
              <p className="text-sm text-[rgb(161,161,170)]">Operating as Fastofy.com</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-4">
              <p className="text-xs font-semibold text-[rgb(218,255,1)] uppercase tracking-widest mb-1">Controller</p>
              <p className="font-semibold text-white">The Fastofy User / Customer</p>
              <p className="text-sm text-[rgb(161,161,170)]">As identified in their account</p>
            </div>
          </div>
          <p className="text-sm text-[rgb(161,161,170)]">
            This DPA applies where personal data subject to GDPR or similar data protection laws is processed by
            Fastofy on behalf of the user.
          </p>
        </div>
      }
      sections={SECTIONS}
    />
  );
}
