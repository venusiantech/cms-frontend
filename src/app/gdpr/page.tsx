import LegalLayout from '@/components/legal/LegalLayout';

const SECTIONS = [
  {
    id: 'lawful-basis',
    title: '1. Lawful Basis for Processing',
    content: (
      <div className="space-y-4">
        <p>We process personal data under one or more of the following lawful bases:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Contractual Necessity',
              desc: 'Processing is required to fulfill our service agreement with you — for example, creating your account and generating your website.',
            },
            {
              title: 'Legitimate Interests',
              desc: 'We process data to operate, improve, and secure our platform, where those interests are not overridden by your rights.',
            },
            {
              title: 'User Consent',
              desc: 'Where required by law, we request your explicit consent before processing — for example, for non-essential cookies or marketing communications.',
            },
            {
              title: 'Legal Obligations',
              desc: 'We may process data to comply with applicable laws, court orders, or regulatory requirements.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-4">
              <p className="font-semibold text-white mb-1.5">{item.title}</p>
              <p className="text-sm text-[rgb(161,161,170)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'your-rights',
    title: '2. Your GDPR Rights',
    content: (
      <div className="space-y-4">
        <p>If you are a resident of the EU/EEA, you have the following rights under GDPR:</p>
        <div className="space-y-3">
          {[
            {
              right: 'Right to Access',
              desc: 'You may request a copy of the personal data we hold about you at any time.',
            },
            {
              right: 'Right to Rectification',
              desc: 'You may ask us to correct inaccurate or incomplete personal data.',
            },
            {
              right: 'Right to Erasure',
              desc: 'You may request deletion of your personal data ("right to be forgotten"), subject to legal retention obligations.',
            },
            {
              right: 'Right to Restrict Processing',
              desc: 'You may ask us to limit how we use your data in certain circumstances.',
            },
            {
              right: 'Right to Object',
              desc: 'You may object to processing based on legitimate interests or for direct marketing purposes.',
            },
            {
              right: 'Right to Data Portability',
              desc: 'You may request your data in a structured, machine-readable format to transfer to another service.',
            },
            {
              right: 'Right to Withdraw Consent',
              desc: 'Where processing is based on consent, you may withdraw it at any time without affecting prior processing.',
            },
          ].map((item) => (
            <div key={item.right} className="flex gap-4">
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0 mt-2" />
              <div>
                <span className="font-semibold text-white">{item.right}: </span>
                <span>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[rgba(218,255,1,0.2)] bg-[rgba(218,255,1,0.05)] p-5 mt-2">
          <p className="font-medium text-white mb-2">To exercise any of these rights:</p>
          <a
            href="mailto:support@fastofy.com"
            className="inline-flex items-center gap-2 text-[rgb(218,255,1)] font-medium hover:underline"
          >
            📧 support@fastofy.com
          </a>
          <p className="text-sm text-[rgb(161,161,170)] mt-2">
            We will respond within <strong className="text-white">30 days</strong>. We may need to verify your identity
            before processing your request.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'data-transfers',
    title: '3. Data Transfers Outside the EU',
    content: (
      <div className="space-y-3">
        <p>
          Fastofy operates globally, and your personal data may be transferred to and processed in countries outside
          the European Economic Area (EEA), including the UAE and the USA.
        </p>
        <p>Where such transfers occur, we ensure appropriate safeguards are in place, including:</p>
        <ul className="space-y-1.5 list-none">
          {[
            'Standard Contractual Clauses (SCCs) approved by the European Commission',
            'Adequacy decisions where applicable',
            'Data Processing Agreements (DPAs) with all sub-processors',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-[rgb(161,161,170)]">
          By using Fastofy.com, you acknowledge and consent to these international data transfers.
        </p>
      </div>
    ),
  },
  {
    id: 'data-retention',
    title: '4. Data Retention',
    content: (
      <div className="space-y-3">
        <p>We retain personal data only for as long as necessary for the purposes it was collected. Specifically:</p>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[rgba(255,255,255,0.03)]">
                <th className="text-left px-4 py-3 font-semibold text-white">Data Category</th>
                <th className="text-left px-4 py-3 font-semibold text-white">Retention Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['Account data', 'Duration of account + 30 days after deletion'],
                ['Billing records', '7 years (legal/tax compliance)'],
                ['Website content', 'Duration of account'],
                ['Analytics data', '26 months (anonymized)'],
                ['Support communications', '3 years'],
                ['Security logs', '12 months'],
              ].map(([category, period]) => (
                <tr key={category} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="px-4 py-3 text-[rgb(218,218,218)]">{category}</td>
                  <td className="px-4 py-3 text-[rgb(161,161,170)]">{period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>You may request deletion of your account and associated data at any time by contacting us.</p>
      </div>
    ),
  },
  {
    id: 'data-protection-officer',
    title: '5. Data Controller',
    content: (
      <div className="space-y-3">
        <p>
          The data controller responsible for your personal data is:
        </p>
        <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-5 space-y-1">
          <p className="font-semibold text-white text-lg">Fastofy</p>
          <p>Venusian LLC</p>
          <p>Registered in the United Arab Emirates</p>
          <a
            href="mailto:app@fastofy.com"
            className="inline-flex items-center gap-2 mt-2 text-[rgb(218,255,1)] font-medium hover:underline"
          >
            📧 app@fastofy.com
          </a>
        </div>
        <p className="text-sm text-[rgb(161,161,170)]">
          For GDPR-specific inquiries, you may also contact us at{' '}
          <a href="mailto:support@fastofy.com" className="text-[rgb(218,255,1)] hover:underline">
            support@fastofy.com
          </a>
          . We aim to resolve all privacy concerns promptly.
        </p>
      </div>
    ),
  },
  {
    id: 'lodge-complaint',
    title: '6. Right to Lodge a Complaint',
    content: (
      <div className="space-y-3">
        <p>
          If you believe we have not handled your personal data in accordance with applicable data protection laws,
          you have the right to lodge a complaint with your local supervisory authority.
        </p>
        <p>For EU residents, this is typically the data protection authority in your country of residence. For example:</p>
        <ul className="space-y-1.5 list-none">
          {[
            'Ireland: Data Protection Commission (DPC)',
            'Germany: Bundesdatenschutzbeauftragter (BfDI)',
            'France: Commission nationale de l\'informatique et des libertés (CNIL)',
            'UK (post-Brexit): Information Commissioner\'s Office (ICO)',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p>We encourage you to contact us first so we can try to resolve your concern directly.</p>
      </div>
    ),
  },
];

export default function GdprPage() {
  return (
    <LegalLayout
      title="GDPR Compliance"
      effectiveDate="1st January 2026"
      lastUpdated="27th February 2026"
      intro={
        <div className="space-y-3">
          <p>
            <strong className="text-white">Fastofy.com</strong>, operated by{' '}
            <strong className="text-white">Venusian LLC</strong>, is committed to complying with the{' '}
            <strong className="text-white">General Data Protection Regulation (GDPR)</strong> for users in the
            European Economic Area (EEA) and United Kingdom.
          </p>
          <p>
            This statement explains how we fulfill our GDPR obligations, the lawful bases on which we process your
            data, your rights as a data subject, and how to exercise them.
          </p>
          <p className="text-sm text-[rgb(161,161,170)]">
            For full details on what data we collect and how we use it, please also read our{' '}
            <a href="/privacy-policy" className="text-[rgb(218,255,1)] hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      }
      sections={SECTIONS}
    />
  );
}
