'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { stripeAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Loader2,
  CreditCard,
  Zap,
  ExternalLink,
  AlertCircle,
  Calendar,
  Sparkles,
  X,
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  creditsPerMonth: number;
  maxWebsites: number;
  stripePriceId?: string | null;
  isCustom?: boolean;
  isActive: boolean;
}

interface Subscription {
  status: string;
  planId: string;
  creditsRemaining: number;
  currentPeriodEnd?: string;
  stripeSubscriptionId?: string;
  cancelAtPeriodEnd?: boolean;
  plan?: Plan;
}

export default function SettingsSubscriptionPage() {
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const { data: plans = [] } = useQuery({
    queryKey: ['stripe-plans'],
    queryFn: async () => {
      const res = await stripeAPI.getPlans();
      return res.data as Plan[];
    },
  });

  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ['stripe-subscription'],
    queryFn: async () => {
      const res = await stripeAPI.getSubscription();
      return res.data as Subscription | null;
    },
  });

  const customPlanMutation = useMutation({
    mutationFn: (message: string) => stripeAPI.requestCustomPlan(message),
    onSuccess: () => {
      toast.success('Request submitted! Our team will reach out shortly.');
      setShowCustomModal(false);
      setCustomMessage('');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to submit request'),
  });

  const subscribeMutation = useMutation({
    mutationFn: (planId: string) => {
      setPendingPlanId(planId);
      return stripeAPI.subscribe(planId);
    },
    onSuccess: (res: any) => {
      window.location.href = res.data.url;
    },
    onError: (e: any) => {
      setPendingPlanId(null);
      toast.error(e.response?.data?.message || 'Failed to start checkout');
    },
  });

  const portalMutation = useMutation({
    mutationFn: () => stripeAPI.portal(),
    onSuccess: (res: any) => {
      window.location.href = res.data.url;
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to open billing portal'),
  });

  if (subLoading) {
    return (
      <div className="px-4 lg:px-6 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  const planName = subscription?.plan?.name ?? '—';
  const isFreePlan = (subscription?.plan?.price ?? 0) === 0 && !subscription?.plan?.isCustom;
  const isCancelling = Boolean(subscription?.cancelAtPeriodEnd && subscription?.status === 'ACTIVE');
  const periodEnd = subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : null;
  const endDate = periodEnd ? periodEnd.toLocaleDateString() : '—';

  const statusLabel =
    !subscription || subscription.status === 'none'
      ? 'No plan'
      : isCancelling
        ? `Cancels ${endDate}`
        : subscription.status === 'ACTIVE'
          ? 'Active'
          : subscription.status === 'PENDING_PAYMENT'
            ? 'Pending payment'
            : 'Cancelled';

  const statusClasses =
    !subscription || subscription.status === 'none'
      ? 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'
      : isCancelling
        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
        : subscription.status === 'ACTIVE'
          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
          : subscription.status === 'PENDING_PAYMENT'
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            : 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20';

  return (
    <div className="px-4 lg:px-6 w-full max-w-7xl mx-auto">
      <div className="space-y-5">
        {/* Current plan (make it instantly obvious) */}
        <div className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] overflow-hidden">
          <div className="relative px-6 py-5">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-transparent" />
            <div className="relative flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                    <CreditCard size={16} className="text-neutral-300" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      Current plan
                    </p>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-semibold text-neutral-100 leading-none">{planName}</h2>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusClasses}`}>
                        {statusLabel}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      {subscription && subscription.status !== 'none'
                        ? isFreePlan
                          ? 'Free plan (one-time credits).'
                          : 'Billing and usage overview.'
                        : 'Choose a plan to get started.'}
                    </p>
                  </div>
                </div>

                {subscription && subscription.status === 'ACTIVE' && subscription.stripeSubscriptionId && (
                  <button
                    onClick={() => portalMutation.mutate()}
                    disabled={portalMutation.isPending}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs transition-colors disabled:opacity-50 ${
                      subscription.cancelAtPeriodEnd
                        ? 'border-orange-500/40 text-orange-400 hover:bg-orange-500/10'
                        : 'border-neutral-700 text-neutral-300 hover:bg-neutral-800/60'
                    }`}
                  >
                    {portalMutation.isPending ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <ExternalLink size={12} />
                    )}
                    {subscription.cancelAtPeriodEnd ? 'Manage (reactivate)' : 'Manage plan'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="rounded-xl border border-neutral-800 bg-black/30 px-4 py-3">
                  <p className="text-[11px] text-neutral-400">Credits remaining</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-100">
                    {subscription?.creditsRemaining ?? 0}
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-black/30 px-4 py-3">
                  <p className="text-[11px] text-neutral-400">Price</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-100">
                    {!subscription || subscription.status === 'none'
                      ? '—'
                      : (subscription.plan?.price ?? 0) === 0
                        ? 'Free'
                        : `$${subscription.plan?.price}`}
                    {!subscription || subscription.status === 'none' || (subscription.plan?.price ?? 0) === 0 ? null : (
                      <span className="ml-1 text-xs font-normal text-neutral-400">/mo</span>
                    )}
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-black/30 px-4 py-3">
                  <p className="text-[11px] text-neutral-400">Websites</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-100">
                    {subscription?.plan?.maxWebsites ?? '—'}
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-black/30 px-4 py-3">
                  <p className="text-[11px] text-neutral-400">{isCancelling ? 'Ends on' : 'Renews'}</p>
                  <p className="mt-1 text-sm font-medium text-neutral-200 flex items-center gap-1.5">
                    <Calendar size={13} className="text-neutral-600" />
                    {endDate}
                  </p>
                </div>
              </div>

              {!subscription || subscription.status === 'none' ? (
                <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-black/30 px-4 py-3">
                  <AlertCircle size={16} className="text-neutral-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-200">No active subscription</p>
                    <p className="text-xs text-neutral-400">Pick a plan below to unlock more credits and websites.</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
            Available Plans
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {plans.filter((p) => !p.isCustom).map((plan) => {
              const isCurrent = subscription?.planId === plan.id;
              const isThisPending = pendingPlanId === plan.id && subscribeMutation.isPending;
              const isFreePlan = plan.price === 0 && !plan.isCustom;
              return (
                <div
                  key={plan.id}
                  className={`relative bg-[#0a0a0a] border rounded-2xl p-5 flex flex-col gap-3 transition-colors ${
                    isCurrent
                      ? 'border-violet-400/40 shadow-[0_0_0_1px_rgba(167,139,250,0.15)]'
                      : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-400 text-black">
                      Current
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-neutral-100">{plan.name}</p>
                    <p className="text-2xl font-bold text-neutral-100 mt-1">
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                      {plan.price > 0 && (
                        <span className="text-xs text-neutral-400 font-normal ml-1">/mo</span>
                      )}
                    </p>
                  </div>
                  <ul className="space-y-1.5 flex-1">
                    <li className="flex items-center gap-2 text-xs text-neutral-400">
                      <Zap size={11} className="text-neutral-400 flex-shrink-0" />
                      {plan.creditsPerMonth} credits
                      {isFreePlan ? ' (one-time)' : ' / month'}
                    </li>
                    <li className="flex items-center gap-2 text-xs text-neutral-400">
                      <Zap size={11} className="text-neutral-400 flex-shrink-0" />
                      Up to {plan.maxWebsites} website{plan.maxWebsites !== 1 ? 's' : ''}
                    </li>
                  </ul>
                  <button
                    disabled={isCurrent || !plan.stripePriceId || subscribeMutation.isPending}
                    onClick={() => subscribeMutation.mutate(plan.id)}
                    className={`w-full py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-[#262626] text-neutral-400 cursor-default'
                        : !plan.stripePriceId
                        ? 'bg-[#262626] text-neutral-400 cursor-not-allowed'
                        : subscribeMutation.isPending && !isThisPending
                        ? 'bg-[#262626] text-neutral-400 cursor-not-allowed'
                        : 'bg-white hover:bg-neutral-200 text-black'
                    }`}
                  >
                    {isThisPending && <Loader2 size={11} className="animate-spin" />}
                    {isCurrent
                      ? 'Current Plan'
                      : isFreePlan
                      ? 'Free'
                      : isThisPending
                      ? 'Redirecting...'
                      : 'Upgrade'}
                  </button>
                </div>
              );
            })}

            {(() => {
              const isCurrentCustom = subscription?.plan?.isCustom === true;
              return (
                <div
                  className={`relative bg-[#0a0a0a] rounded-xl p-5 flex flex-col gap-3 transition-colors ${
                    isCurrentCustom
                      ? 'border border-purple-500/40'
                      : 'border border-dashed border-neutral-700 hover:border-neutral-500'
                  }`}
                >
                  {isCurrentCustom && (
                    <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500 text-white">
                      Current
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-neutral-100 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-purple-400" />
                      Custom / Enterprise
                    </p>
                    <p className="text-2xl font-bold text-neutral-100 mt-1">
                      {isCurrentCustom ? subscription?.plan?.name ?? 'Custom' : 'Custom'}
                      {!isCurrentCustom && (
                        <span className="text-xs text-neutral-400 font-normal ml-1">pricing</span>
                      )}
                    </p>
                  </div>
                  <ul className="space-y-1.5 flex-1">
                    <li className="flex items-center gap-2 text-xs text-neutral-400">
                      <Zap
                        size={11}
                        className={
                          isCurrentCustom ? 'text-purple-400 flex-shrink-0' : 'text-neutral-400 flex-shrink-0'
                        }
                      />
                      {isCurrentCustom
                        ? `${subscription?.creditsRemaining ?? 0} credits remaining`
                        : 'Unlimited credits'}
                    </li>
                    <li className="flex items-center gap-2 text-xs text-neutral-400">
                      <Zap
                        size={11}
                        className={
                          isCurrentCustom ? 'text-purple-400 flex-shrink-0' : 'text-neutral-400 flex-shrink-0'
                        }
                      />
                      {isCurrentCustom
                        ? `Up to ${subscription?.plan?.maxWebsites ?? '—'} websites`
                        : 'Unlimited websites'}
                    </li>
                  </ul>
                  {isCurrentCustom ? (
                    <div className="w-full py-2 rounded-lg text-xs font-medium bg-purple-600/10 text-purple-300 border border-purple-500/20 text-center">
                      Active Custom Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCustomModal(true)}
                      className="w-full py-2 rounded-lg text-xs font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-colors"
                    >
                      Request Custom Plan
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

      </div>

      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-neutral-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-purple-400" />
                <h3 className="text-sm font-semibold text-neutral-100">Request Custom Plan</h3>
              </div>
              <button
                onClick={() => {
                  setShowCustomModal(false);
                  setCustomMessage('');
                }}
                className="text-neutral-400 hover:text-neutral-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-xs text-neutral-400">
                Tell us about your requirements — number of websites, monthly blog volume, team size,
                or any specific needs. Our team will review your request and reach out with a
                tailored quote.
              </p>
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Your requirements</label>
                <textarea
                  rows={5}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="e.g. We need to manage 500+ domains, generate 50 blogs/day, with dedicated support..."
                  className="w-full bg-[#171717] border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowCustomModal(false);
                    setCustomMessage('');
                  }}
                  className="px-4 py-2 text-xs text-neutral-400 border border-neutral-700 rounded-lg hover:bg-[#262626] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => customPlanMutation.mutate(customMessage)}
                  disabled={!customMessage.trim() || customPlanMutation.isPending}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {customPlanMutation.isPending ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Sparkles size={12} />
                  )}
                  {customPlanMutation.isPending ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
