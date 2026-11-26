"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { QRCodeSVG } from "qrcode.react"
import {
  ArrowUpRight,
  Check,
  Copy,
  Handshake,
  Megaphone,
  Mic,
  Newspaper,
  QrCode,
  Share2,
  UserPlus,
  X,
} from "lucide-react"
import { SocialIcon, socials } from "@/components/site-shell"
import { site } from "@/lib/content"

const DEFAULT_PROFILE_URL = "https://kcooperdev.com"

function ShareCardModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const [profileUrl, setProfileUrl] = useState(DEFAULT_PROFILE_URL)

  useEffect(() => {
    if (typeof window !== "undefined" && window.location?.origin) {
      const origin = window.location.origin
      if (!origin.includes("localhost") && !origin.includes("127.0.0.1")) {
        setProfileUrl(origin)
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  async function handleCopyLink() {
    const urlToCopy =
      typeof window !== "undefined" ? window.location.href : profileUrl
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(urlToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function handleNativeShare() {
    const urlToShare =
      typeof window !== "undefined" ? window.location.href : profileUrl
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: site.name,
          text: `${site.name} — ${site.credentials}`,
          url: urlToShare,
        })
        return
      } catch {
        // User cancelled or share failed; fall back to copy
      }
    }
    await handleCopyLink()
  }

  function handleSaveContact() {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Cooper;Khalif;;;",
      `FN:${site.name}`,
      "TITLE:Software Engineer & Founder of Bmore Tech Week",
      `EMAIL;TYPE=INTERNET:${site.email}`,
      `URL:${profileUrl}`,
      ...socials.map((s) => `X-SOCIALPROFILE;TYPE=${s.label}:${s.href}`),
      `NOTE:${site.credentials}`,
      "END:VCARD",
    ].join("\r\n")

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "Khalif-Cooper.vcf"
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-card-title"
        className="relative max-h-[92svh] w-full max-w-[380px] overflow-auto rounded-t-[32px] bg-[#F7F4EF] p-5 text-center shadow-2xl sm:rounded-[32px] sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-neutral-300 sm:hidden" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close share card"
          className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200/80 text-neutral-700 transition-colors hover:bg-neutral-300"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Mini Identity Header */}
        <div className="flex flex-col items-center pt-1">
          <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white bg-[#3BA9F4] shadow-sm">
            <Image
              src="/khalif.jpg"
              alt={site.name}
              width={112}
              height={112}
              className="h-full w-full object-cover"
            />
          </div>
          <h2
            id="share-card-title"
            className="mt-2 font-serif text-xl font-normal tracking-tight text-neutral-950"
          >
            {site.name}
          </h2>
          <p className="mt-0.5 text-[11px] font-medium text-neutral-600">
            {site.credentials}
          </p>
        </div>

        {/* Blinq-style QR Code Card */}
        <div className="mx-auto mt-4 flex flex-col items-center rounded-[24px] border border-neutral-900/10 bg-white p-5 shadow-sm">
          <div className="relative flex items-center justify-center rounded-2xl bg-white p-1">
            <QRCodeSVG
              value={profileUrl}
              size={200}
              bgColor="#FFFFFF"
              fgColor="#0A0A0A"
              level="M"
            />
          </div>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            Point camera to connect
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSaveContact}
            className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800"
          >
            <UserPlus className="h-4 w-4" aria-hidden />
            <span>Save to Contacts</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-neutral-900/15 bg-white px-4 text-xs font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-neutral-900/15 bg-white px-4 text-xs font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
            >
              <Share2 className="h-3.5 w-3.5" aria-hidden />
              <span>Share Link</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}

export function HomeStage() {
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <div className="min-h-svh w-full bg-[#EFECE6] px-0 py-0 text-neutral-950 sm:px-4 sm:py-8 md:py-12">
      <div className="mx-auto min-h-svh w-full max-w-[440px] overflow-hidden bg-[#F7F4EF] pb-8 sm:min-h-0 sm:rounded-[36px] sm:border sm:border-neutral-900/10 sm:shadow-[0_24px_70px_-15px_rgba(0,0,0,0.12)]">
        {/* Profile Header */}
        <header className="relative overflow-hidden px-5 pt-3 pb-4 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#D9E8F5]/70 via-[#EAE4DC]/40 to-transparent"
          />

          <div className="relative z-10 flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              aria-label="Open QR code and share options"
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-white/85 px-3 text-xs font-medium text-neutral-800 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
            >
              <QrCode className="h-3.5 w-3.5" aria-hidden />
              <span>Share</span>
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-[3px] border-white bg-[#3BA9F4] shadow-md sm:h-24 sm:w-24">
              <Image
                src="/khalif.jpg"
                alt={site.name}
                width={192}
                height={192}
                priority
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-2.5 flex items-center justify-center gap-1.5">
              <h1 className="font-serif text-2xl font-normal tracking-tight text-neutral-950">
                {site.name}
              </h1>
            </div>

            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
              Engineer · AI Educator · Community Builder
            </p>

            <p className="mt-1.5 max-w-[34ch] text-xs leading-relaxed text-neutral-700">
              {site.credentials}
            </p>

            {/* Social Media Logos (LinkedIn, X, Bluesky, Threads, GitHub) */}
            <nav
              aria-label="Social media"
              className="mt-3 flex flex-wrap items-center justify-center gap-2"
            >
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-900/10 bg-white text-neutral-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-neutral-950 hover:text-white"
                >
                  <SocialIcon className="h-4 w-4" path={item.path} />
                </a>
              ))}
            </nav>
          </div>
        </header>

        {/* Focused Link-in-Bio Content */}
        <div className="flex flex-col gap-5 px-4 sm:px-5">
          {/* Primary Links */}
          <section aria-label="Primary links" className="flex flex-col gap-2.5">
            {/* 1. Book Me to Speak */}
            <a
              href="https://calendar.app.google/2epk2x9obh44pbna8"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-14 w-full items-center justify-between gap-3 rounded-[20px] border border-neutral-900/12 bg-white px-4 py-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-neutral-950"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#3BA9F4]/15 text-[#0B66A3]">
                  <Mic className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-neutral-950">
                    Book Me to Speak
                  </p>
                  <p className="truncate text-xs text-neutral-600">
                    Talks, panels & hands-on AI workshops
                  </p>
                </div>
              </div>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-950"
                aria-hidden
              />
            </a>

            {/* 2. Substack Newsletter */}
            <a
              href="https://substack.com/@kcoopercodes"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-14 w-full items-center justify-between gap-3 rounded-[20px] border border-neutral-900/12 bg-white px-4 py-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-neutral-950"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-emerald-100 text-emerald-900">
                  <Newspaper className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-neutral-950">
                    Read My Blog
                  </p>
                  <p className="truncate text-xs text-neutral-600">
                    Helping everyday people use AI to get ahead.
                  </p>
                </div>
              </div>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-950"
                aria-hidden
              />
            </a>
          </section>

          {/* Bmore Tech Week Links */}
          <section
            aria-label="Bmore Tech Week"
            className="flex flex-col gap-2.5"
          >
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                Bmore Tech Week · April 26–28th, 2027
              </p>
              <a
                href="https://www.bmoretechweek.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 transition-colors hover:text-neutral-950"
              >
                <span>bmoretechweek.com</span>
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
            </div>

            {/* 3. Sponsor Bmore Tech Week */}
            <a
              href="https://www.bmoretechweek.com/sponsors"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-14 w-full items-center justify-between gap-3 rounded-[20px] border border-neutral-900/12 bg-white px-4 py-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-neutral-950"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-amber-100 text-amber-900">
                  <Handshake className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-neutral-950">
                    Sponsor Bmore Tech Week
                  </p>
                  <p className="truncate text-xs text-neutral-600">
                    Partner with Baltimore&apos;s flagship tech gathering
                  </p>
                </div>
              </div>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-950"
                aria-hidden
              />
            </a>

            {/* 4. Speak at Bmore Tech Week */}
            <a
              href="https://www.bmoretechweek.com/speak"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-14 w-full items-center justify-between gap-3 rounded-[20px] border border-neutral-900/12 bg-white px-4 py-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-neutral-950"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-violet-100 text-violet-900">
                  <Megaphone className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-neutral-950">
                    Speak at Bmore Tech Week
                  </p>
                  <p className="truncate text-xs text-neutral-600">
                    Apply to lead a talk, panel, or workshop
                  </p>
                </div>
              </div>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-950"
                aria-hidden
              />
            </a>
          </section>
        </div>
      </div>

      {shareOpen ? (
        <ShareCardModal onClose={() => setShareOpen(false)} />
      ) : null}
    </div>
  )
}
