'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI, stripeAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import {
  Pencil, Loader2, Bell, Mail, Trash2, CheckCircle,
  CreditCard, Zap, ExternalLink, AlertCircle, Calendar, Sparkles, X,
} from 'lucide-react';

type Tab = 'general' | 'notifications' | 'subscription'

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
  ledger?: { id: string; amount: number; description: string; createdAt: string }[];
}

export default function SettingsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [isEditing, setIsEditing] = useState(false);

  // ── Form state ─────────────────────────────────────────────────
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // ── Notification state ─────────────────────────────────────────
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [notificationEmails, setNotificationEmails] = useState<string[]>(['', '']);

  // ── Fetch profile ──────────────────────────────────────────────
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await usersAPI.getProfile();
      return res.data;
    },
  });

  // Populate form when data arrives
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setDateOfBirth(profile.dateOfBirth || '');
      setMobileNumber(profile.mobileNumber || '');
      setEmailNotificationsEnabled(profile.emailNotificationsEnabled ?? true);
      const emails = profile.notificationEmails ?? [];
      setNotificationEmails([emails[0] || '', emails[1] || '']);
    }
  }, [profile]);

  // ── Save mutation ──────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof usersAPI.updateProfile>[0]) =>
      usersAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Settings saved successfully!');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    },
  });

  const handleSave = () => {
    const validExtras = notificationEmails.filter((e) => e.trim() !== '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const e of validExtras) {
      if (!emailRegex.test(e)) {
        toast.error(`"${e}" is not a valid email address`);
        return;
      }
    }
    mutation.mutate({
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      dateOfBirth: dateOfBirth.trim() || undefined,
      mobileNumber: mobileNumber.trim() || undefined,
      emailNotificationsEnabled,
      notificationEmails: validExtras,
    });
  };

  const handleCancel = () => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setDateOfBirth(profile.dateOfBirth || '');
      setMobileNumber(profile.mobileNumber || '');
      setEmailNotificationsEnabled(profile.emailNotificationsEnabled ?? true);
      const emails = profile.notificationEmails ?? [];
      setNotificationEmails([emails[0] || '', emails[1] || '']);
    }
    setIsEditing(false);
  };

  const setNotifEmail = (index: number, value: string) => {
    setNotificationEmails((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  // ── Subscription data ──────────────────────────────────────────
  const { data: plans = [] } = useQuery({
    queryKey: ['stripe-plans'],
    queryFn: async () => { const res = await stripeAPI.getPlans(); return res.data as Plan[]; },
    enabled: activeTab === 'subscription',
  });

  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ['stripe-subscription'],
    queryFn: async () => { const res = await stripeAPI.getSubscription(); return res.data as Subscription | null; },
    enabled: activeTab === 'subscription',
  });

  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  // ── Custom plan request modal ──────────────────────────────────
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

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
    mutationFn: (planId: string) => { setPendingPlanId(planId); return stripeAPI.subscribe(planId); },
    onSuccess: (res: any) => { window.location.href = res.data.url; },
    onError: (e: any) => { setPendingPlanId(null); toast.error(e.response?.data?.message || 'Failed to start checkout'); },
  });

  const portalMutation = useMutation({
    mutationFn: () => stripeAPI.portal(),
    onSuccess: (res: any) => { window.location.href = res.data.url; },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to open billing portal'),
  });

  const TABS: { id: Tab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'subscription', label: 'Subscription' },
  ];

  if (isLoading) {
    return (
      <div className="px-4 lg:px-8 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 w-full max-w-full">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-100">Settings</h1>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────── */}
      <div className="flex gap-0 border-b border-neutral-700 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-white text-neutral-100'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── General Tab ───────────────────────────────────────────── */}
      {activeTab === 'general' && (
        <div className="space-y-5">
          {/* Account Information */}
          <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl overflow-hidden">
            {/* Section header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
              <div>
                <h2 className="text-sm font-semibold text-neutral-100">Account Information</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Update your account information</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-600 text-xs text-neutral-300 hover:bg-neutral-800 transition-colors"
                >
                  <Pencil size={12} />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={mutation.isPending}
                    className="px-3 py-1.5 rounded-lg border border-neutral-600 text-xs text-neutral-400 hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={mutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
                  >
                    {mutation.isPending ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <CheckCircle size={11} />
                    )}
                    Save
                  </button>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="px-6 py-5">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                Personal Information
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!isEditing}
                    placeholder={isEditing ? 'Enter first name' : '—'}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors disabled:opacity-60 disabled:cursor-default"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!isEditing}
                    placeholder={isEditing ? 'Enter last name' : '—'}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors disabled:opacity-60 disabled:cursor-default"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-neutral-500 transition-colors disabled:opacity-60 disabled:cursor-default [color-scheme:dark]"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={!isEditing}
                    placeholder={isEditing ? '+1 234 567 8900' : '—'}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors disabled:opacity-60 disabled:cursor-default"
                  />
                </div>

                {/* Email — full width, always read-only */}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-neutral-500 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-400 cursor-default select-none focus:outline-none"
                  />
                  <p className="text-xs text-neutral-600 mt-1">Email cannot be changed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Subscription Tab ──────────────────────────────────────── */}
      {activeTab === 'subscription' && (
        <div className="space-y-5">
          {subLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
            </div>
          ) : (
            <>
              {/* Current plan card */}
              <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-neutral-700">
                  <CreditCard size={14} className="text-neutral-400" />
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-100">Current Subscription</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Your active plan and credits</p>
                  </div>
                </div>
                <div className="px-6 py-5">
                  {!subscription || subscription.status === 'none' ? (
                    <div className="flex items-center gap-3 text-neutral-400 text-sm">
                      <AlertCircle size={15} />
                      <span>No active subscription found.</span>
                    </div>
                  ) : (
                    (() => {
                      const isFreePlan = (subscription.plan?.price ?? 0) === 0 && !subscription.plan?.isCustom;
                      const isCancelling = subscription.cancelAtPeriodEnd && subscription.status === 'ACTIVE';
                      const endDate = subscription.currentPeriodEnd
                        ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                        : '—';
                      return (
                        <div className={`grid gap-4 ${isFreePlan ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
                          <div>
                            <p className="text-xs text-neutral-500 mb-1">Plan</p>
                            <p className="text-sm font-semibold text-neutral-100">
                              {subscription.plan?.name ?? '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-500 mb-1">Credits Left</p>
                            <p className="text-sm font-semibold text-neutral-100">
                              {subscription.creditsRemaining ?? 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-500 mb-1">Status</p>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              isCancelling
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : subscription.status === 'ACTIVE'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : subscription.status === 'PENDING_PAYMENT'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'
                            }`}>
                              {isCancelling
                                ? `Cancels ${endDate}`
                                : subscription.status === 'ACTIVE'
                                ? 'Active'
                                : subscription.status === 'PENDING_PAYMENT'
                                ? 'Pending Payment'
                                : 'Cancelled'}
                            </span>
                          </div>
                          {!isFreePlan && (
                            <div>
                              <p className="text-xs text-neutral-500 mb-1">
                                {isCancelling ? 'Ends On' : 'Renews'}
                              </p>
                              <p className="text-xs text-neutral-400 flex items-center gap-1">
                                <Calendar size={11} />
                                {endDate}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  )}
                  {subscription && subscription.status === 'ACTIVE' && subscription.stripeSubscriptionId && (
                    <div className="mt-4 pt-4 border-t border-neutral-800">
                      <button
                        onClick={() => portalMutation.mutate()}
                        disabled={portalMutation.isPending}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs transition-colors disabled:opacity-50 ${
                          subscription.cancelAtPeriodEnd
                            ? 'border-orange-500/40 text-orange-400 hover:bg-orange-500/10'
                            : 'border-neutral-600 text-neutral-300 hover:bg-neutral-800'
                        }`}
                      >
                        {portalMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <ExternalLink size={12} />}
                        {subscription.cancelAtPeriodEnd ? 'Reactivate / Manage Subscription' : 'Manage / Cancel Subscription'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Plan cards */}
              <div>
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Available Plans</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {plans.filter((p) => !p.isCustom).map((plan) => {
                    const isCurrent = subscription?.planId === plan.id;
                    const isThisPending = pendingPlanId === plan.id && subscribeMutation.isPending;
                    const isFreePlan = plan.price === 0 && !plan.isCustom;
                    return (
                      <div
                        key={plan.id}
                        className={`relative bg-[#0a0a0a] border rounded-xl p-5 flex flex-col gap-3 transition-colors ${
                          isCurrent ? 'border-white/30' : 'border-neutral-700 hover:border-neutral-600'
                        }`}
                      >
                        {isCurrent && (
                          <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-black">
                            Current
                          </span>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-neutral-100">{plan.name}</p>
                          <p className="text-2xl font-bold text-neutral-100 mt-1">
                            {plan.price === 0 ? 'Free' : `$${plan.price}`}
                            {plan.price > 0 && <span className="text-xs text-neutral-500 font-normal ml-1">/mo</span>}
                          </p>
                        </div>
                        <ul className="space-y-1.5 flex-1">
                          <li className="flex items-center gap-2 text-xs text-neutral-400">
                            <Zap size={11} className="text-neutral-500 flex-shrink-0" />
                            {plan.creditsPerMonth} credits{isFreePlan ? ' (one-time)' : ' / month'}
                          </li>
                          <li className="flex items-center gap-2 text-xs text-neutral-400">
                            <Zap size={11} className="text-neutral-500 flex-shrink-0" />
                            Up to {plan.maxWebsites} website{plan.maxWebsites !== 1 ? 's' : ''}
                          </li>
                        </ul>
                        <button
                          disabled={isCurrent || !plan.stripePriceId || subscribeMutation.isPending}
                          onClick={() => subscribeMutation.mutate(plan.id)}
                          className={`w-full py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                            isCurrent
                              ? 'bg-neutral-800 text-neutral-500 cursor-default'
                              : !plan.stripePriceId
                              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                              : subscribeMutation.isPending && !isThisPending
                              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                              : 'bg-white hover:bg-neutral-200 text-black'
                          }`}
                        >
                          {isThisPending && <Loader2 size={11} className="animate-spin" />}
                          {isCurrent ? 'Current Plan' : isFreePlan ? 'Free' : isThisPending ? 'Redirecting...' : 'Upgrade'}
                        </button>
                      </div>
                    );
                  })}

                  {/* Custom / Enterprise card */}
                  {(() => {
                    const isCurrentCustom = subscription?.plan?.isCustom === true;
                    return (
                      <div className={`relative bg-[#0a0a0a] rounded-xl p-5 flex flex-col gap-3 transition-colors ${
                        isCurrentCustom
                          ? 'border border-purple-500/40'
                          : 'border border-dashed border-neutral-700 hover:border-neutral-500'
                      }`}>
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
                            {!isCurrentCustom && <span className="text-xs text-neutral-500 font-normal ml-1">pricing</span>}
                          </p>
                        </div>
                        <ul className="space-y-1.5 flex-1">
                          <li className="flex items-center gap-2 text-xs text-neutral-400">
                            <Zap size={11} className={isCurrentCustom ? 'text-purple-400 flex-shrink-0' : 'text-neutral-500 flex-shrink-0'} />
                            {isCurrentCustom ? `${subscription?.creditsRemaining ?? 0} credits remaining` : 'Unlimited credits'}
                          </li>
                          <li className="flex items-center gap-2 text-xs text-neutral-400">
                            <Zap size={11} className={isCurrentCustom ? 'text-purple-400 flex-shrink-0' : 'text-neutral-500 flex-shrink-0'} />
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

              {/* Credit ledger */}
              {subscription?.ledger && subscription.ledger.length > 0 && (
                <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-neutral-700">
                    <h2 className="text-sm font-semibold text-neutral-100">Credit History</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Last 20 credit transactions</p>
                  </div>
                  <div className="divide-y divide-neutral-800">
                    {subscription.ledger.slice(0, 20).map((entry: any) => (
                      <div key={entry.id} className="flex items-center justify-between px-6 py-3">
                        <div>
                          <p className="text-xs text-neutral-200">{entry.description}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-sm font-semibold ${entry.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {entry.amount > 0 ? '+' : ''}{entry.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Custom Plan Request Modal ─────────────────────────────── */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-neutral-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-purple-400" />
                <h3 className="text-sm font-semibold text-neutral-100">Request Custom Plan</h3>
              </div>
              <button
                onClick={() => { setShowCustomModal(false); setCustomMessage(''); }}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-xs text-neutral-400">
                Tell us about your requirements — number of websites, monthly blog volume, team size, or any specific needs.
                Our team will review your request and reach out with a tailored quote.
              </p>
              <div>
                <label className="block text-xs text-neutral-500 mb-1.5">Your requirements</label>
                <textarea
                  rows={5}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="e.g. We need to manage 500+ domains, generate 50 blogs/day, with dedicated support..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setShowCustomModal(false); setCustomMessage(''); }}
                  className="px-4 py-2 text-xs text-neutral-400 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => customPlanMutation.mutate(customMessage)}
                  disabled={!customMessage.trim() || customPlanMutation.isPending}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {customPlanMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {customPlanMutation.isPending ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Notifications Tab ─────────────────────────────────────── */}
      {activeTab === 'notifications' && (
        <div className="space-y-5">
          <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-neutral-700">
              <Bell size={14} className="text-neutral-400" />
              <div>
                <h2 className="text-sm font-semibold text-neutral-100">Email Notifications</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Control when and where you receive email alerts</p>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Master toggle */}
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm text-neutral-200">Enable email notifications</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Receive emails for website generation, domain deletion, and account activity
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={emailNotificationsEnabled}
                  onClick={() => setEmailNotificationsEnabled((v) => !v)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ml-4 ${
                    emailNotificationsEnabled ? 'bg-white' : 'bg-neutral-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-[#0a0a0a] transition-transform duration-200 ${
                      emailNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>

              {/* Extra recipients */}
              <div className={`space-y-3 transition-opacity duration-200 ${emailNotificationsEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                <div>
                  <p className="text-xs font-medium text-neutral-400">Additional recipients</p>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Up to 2 extra emails that also receive all notification emails
                  </p>
                </div>
                {notificationEmails.map((email, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setNotifEmail(i, e.target.value)}
                        placeholder={`Recipient ${i + 1} email`}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-8 pr-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                      />
                    </div>
                    {email && (
                      <button
                        type="button"
                        onClick={() => setNotifEmail(i, '')}
                        className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Save notifications button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={mutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {mutation.isPending ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <CheckCircle size={13} />
                  )}
                  Save Notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
