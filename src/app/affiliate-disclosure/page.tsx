import LegalLayout from '@/components/legal/LegalLayout';

const SECTIONS = [
  {
    id: 'user-affiliate-programs',
    title: '1. User Affiliate Programs',
    content: (
      <div className="space-y-4">
        <p>
          Fastofy may enable users to integrate affiliate programs such as{' '}
          <strong className="text-white">Amazon Associates</strong> into their websites. Some links generated
          through Fastofy may be affiliate links.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: '💰',
              title: 'Commissions',
              desc: 'The website owner may earn commissions on qualifying purchases made through their affiliate links.',
            },
            {
              icon: '🏷️',
              title: 'No Extra Cost',
              desc: 'There is no additional cost to users who click affiliate links or make purchases.',
            },
            {
              icon: '📝',
              title: 'Editorial Independence',
              desc: 'Affiliate participation does not influence or bias the editorial content generated.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-4 text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="font-semibold text-white mb-1.5">{item.title}</p>
              <p className="text-sm text-[rgb(161,161,170)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'fastofy-affiliate',
    title: '2. Fastofy Affiliate Participation',
    content: (
      <div className="space-y-2">
        <p>
          Fastofy itself may also participate in affiliate programs and may earn commissions from referrals made
          through platform-level links, recommendations, or integrations.
        </p>
        <p>
          These commissions help fund the development and maintenance of the platform and do not affect the pricing
          or quality of services offered to users.
        </p>
      </div>
    ),
  },
  {
    id: 'user-responsibility',
    title: '3. User Responsibility',
    content: (
      <div className="space-y-3">
        <p>
          Users who enable affiliate features on their websites are responsible for complying with all applicable
          affiliate disclosure laws and guidelines, including but not limited to:
        </p>
        <ul className="space-y-2 list-none">
          {[
            'FTC Disclosure Guidelines (USA)',
            'ASA guidelines (UK)',
            'Amazon Associates Program Operating Agreement',
            'Google AdSense program policies',
            'Any other applicable regional regulations',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[rgb(218,255,1)] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] px-4 py-3 text-sm text-[rgb(161,161,170)]">
          Fastofy is not liable for any regulatory penalties arising from a user's failure to properly disclose
          affiliate relationships on their websites.
        </div>
      </div>
    ),
  },
  {
    id: 'recommended-disclosure',
    title: '4. Recommended Disclosure',
    content: (
      <div className="space-y-3">
        <p>
          If your website includes affiliate links, we recommend including a clear disclosure statement visible to
          your visitors, such as:
        </p>
        <div className="rounded-xl border border-[rgba(218,255,1,0.2)] bg-[rgba(218,255,1,0.04)] p-5 italic text-[rgb(218,218,218)]">
          "This website may contain affiliate links. If you click and make a purchase, we may earn a small
          commission at no extra cost to you."
        </div>
        <p className="text-sm text-[rgb(161,161,170)]">
          This disclosure should be placed prominently — ideally near the top of pages containing affiliate links,
          or in your website footer.
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

export default function AffiliateDisclosurePage() {
  return (
    <LegalLayout
      title="Affiliate Disclosure"
      effectiveDate="1st January 2026"
      lastUpdated="1st January 2026"
      intro={
        <div className="space-y-2">
          <p>
            <strong className="text-white">Fastofy.com</strong>, operated by{' '}
            <strong className="text-white">Venusian LLC</strong>, is transparent about affiliate relationships on
            our platform.
          </p>
          <p className="text-sm text-[rgb(161,161,170)]">
            This disclosure applies to both Fastofy's own affiliate activity and to affiliate features available
            to users on their generated websites.
          </p>
        </div>
      }
      sections={SECTIONS}
    />
  );
}
