'use client'

import { useState, useEffect } from 'react'
import { FaCheck, FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import { HiArrowLeft } from 'react-icons/hi'

interface ContactSectionProps {
  domain: { name: string }
  website: {
    contactEmail?: string | null
    contactPhone?: string | null
  }
  onBack: () => void
  assetsPath: string
}

export default function ContactSection({ domain, website, onBack }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/public/contact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: domain.name, ...formData }),
        }
      )

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', message: '' })
      } else {
        alert('Failed to submit form. Please try again.')
      }
    } catch {
      alert('An error occurred. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const siteName = domain.name.split('.')[0]
  const siteDisplay = siteName.charAt(0).toUpperCase() + siteName.slice(1)
  const hasContactInfo = website?.contactEmail || website?.contactPhone

  return (
    <section className="min-h-[60vh] py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            onBack()
          }}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          <HiArrowLeft className="size-4" aria-hidden />
          Back
        </button>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
          {/* Left: intro + contact info */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
              Have a question or want to get in touch? We’d love to hear from you. Fill out the form
              and we’ll get back to you as soon as possible.
            </p>

            {hasContactInfo && (
              <div className="mt-8 space-y-4">
                {website?.contactEmail && (
                  <a
                    href={`mailto:${website.contactEmail}`}
                    className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50/80 px-4 py-3 text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-500 shadow-sm dark:bg-neutral-700 dark:text-neutral-300">
                      <FaEnvelope className="size-5" aria-hidden />
                    </span>
                    <span className="truncate font-medium">{website.contactEmail}</span>
                  </a>
                )}
                {website?.contactPhone && (
                  <a
                    href={`tel:${website.contactPhone}`}
                    className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50/80 px-4 py-3 text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-500 shadow-sm dark:bg-neutral-700 dark:text-neutral-300">
                      <FaPhoneAlt className="size-5" aria-hidden />
                    </span>
                    <span className="font-medium">{website.contactPhone}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right: form or success */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-[#0a0a0a] sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                  <FaCheck className="size-8" aria-hidden />
                </span>
                <h2 className="mt-4 text-xl font-semibold text-neutral-900 dark:text-white">
                  Message sent
                </h2>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                  We’ll get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-lg bg-[#0a0a0a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Send us a message
                </h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  All fields marked with * are required.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder-neutral-400 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-primary-400 dark:focus:ring-primary-400/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder-neutral-400 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-primary-400 dark:focus:ring-primary-400/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="How can we help?"
                      className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder-neutral-400 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-primary-400 dark:focus:ring-primary-400/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-[#0a0a0a] py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-neutral-900 dark:border-t-transparent" aria-hidden />
                        Sending...
                      </span>
                    ) : (
                      'Send message'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
