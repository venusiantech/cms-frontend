import LegalLayout from '@/components/legal/LegalLayout';

const SECTIONS = [
  {
    id: 'subscription-based',
    title: '1. Subscription-Based Services',
    content: (
      <div className="space-y-2">
        <p>Fastofy operates on a subscription-based model.</p>
        <p>By purchasing a subscription, you agree to recurring billing unless canceled prior to renewal.</p>
      </div>
    ),
  },
  {
    id: 'refund-eligibility',
    title: '2. Refund Eligibility',
    content: (
      <div className="space-y-4">
        <p>We offer refunds under the following conditions:</p>
        <div className="rounded-xl border border-[rgba(218,255,1,0.2)] bg-[rgba(218,255,1,0.04)] p-5">
          <p className="font-semibold text-[rgb(218,255,1)] mb-3">✅ Eligible for Refund</p>
          <ul className="space-y-2 list-none">
            {[
              'Duplicate payment',
              'Accidental subscription purchase (within 7 days and no significant platform usage)',
              'Technical failure preventing access to core services',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-[rgba(255,80,80,0.2)] bg-[rgba(255,80,80,0.04)] p-5">
          <p className="font-semibold text-[rgb(255,120,120)] mb-3">❌ Not Eligible for Refund</p>
          <ul className="space-y-2 list-none">
            {[
              'Change of mind after using the platform',
              'Dissatisfaction with AI-generated results',
              'SEO ranking or monetization performance',
              'Failure to cancel before renewal',
              'Account suspension due to policy violations',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(255,120,120)] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'usage-limitation',
    title: '3. Usage-Based Limitation',
    content: (
      <div className="space-y-2">
        <p>
          If substantial platform usage has occurred (e.g., high AI token usage, bulk content generation), refund
          eligibility may be reduced or denied.
        </p>
        <p>Fastofy reserves the right to assess usage before approving refunds.</p>
      </div>
    ),
  },
  {
    id: 'cancellation',
    title: '4. Cancellation Policy',
    content: (
      <div className="space-y-3">
        <p>You may cancel your subscription at any time through your account dashboard.</p>
        <ul className="space-y-2 list-none">
          {[
            'Cancellation prevents future renewals',
            'Access remains active until the end of the billing period',
            'No partial refunds for unused time',
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
    id: 'chargebacks',
    title: '5. Chargebacks',
    content: (
      <div className="space-y-4">
        <p>If you initiate a chargeback without contacting support:</p>
        <ul className="space-y-2 list-none">
          {[
            'Your account may be permanently suspended',
            'Access to content may be revoked',
            'Future access may be denied',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-[rgba(218,255,1,0.2)] bg-[rgba(218,255,1,0.05)] p-4">
          <p className="mb-2">We encourage contacting support first:</p>
          <a
            href="mailto:app@fastofy.com"
            className="text-[rgb(218,255,1)] font-medium hover:underline"
          >
            📧 app@fastofy.com
          </a>
        </div>
      </div>
    ),
  },
  {
    id: 'refund-processing',
    title: '6. Refund Processing',
    content: (
      <div className="space-y-3">
        <p>Approved refunds will be processed via Stripe.</p>
        <ul className="space-y-2 list-none">
          {[
            'Refund time: 5–10 business days',
            'Funds returned to original payment method',
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
    id: 'enterprise',
    title: '7. Enterprise Agreements',
    content: (
      <p>Enterprise clients may have custom refund terms defined in separate agreements.</p>
    ),
  },
  {
    id: 'policy-changes',
    title: '8. Policy Changes',
    content: (
      <p>We reserve the right to modify this Refund Policy at any time. Changes will be posted with a new "Last Updated" date.</p>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      effectiveDate="1st January 2026"
      lastUpdated="27th February 2026"
      intro={
        <div className="space-y-2">
          <p>
            This Refund Policy applies to <strong className="text-white">Fastofy.com</strong> ("Fastofy"), operated
            by <strong className="text-white">Venusian LLC</strong>, registered in the United Arab Emirates.
          </p>
          <p className="text-sm text-[rgb(161,161,170)]">
            Please read this policy carefully before making a purchase. By subscribing, you agree to the terms
            outlined below.
          </p>
        </div>
      }
      sections={SECTIONS}
    />
  );
}
