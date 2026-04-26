import type { Metadata } from 'next'
import Link from 'next/link'
import { HelpCircle, ChevronRight } from 'lucide-react'
import PublicNav from '@/components/layout/PublicNav'
import PublicFooter from '@/components/layout/PublicFooter'
import HelpAccordion from './HelpAccordion'

export const metadata: Metadata = {
  title: 'Help & FAQ',
  description: 'Answers to common questions about Dynamic Garage — adding vehicles, sharing your build, the Document Vault, Community Props, and more.',
  alternates: { canonical: 'https://dynamicgarage.app/help' },
}

const sections = [
  {
    title: '🚀 Getting Started',
    items: [
      {
        q: 'What is Dynamic Garage?',
        a: 'Dynamic Garage is a digital garage for car enthusiasts. You can document your vehicle\'s modifications, full service history, and documents — then share it all with a single link. Think of it as a living build sheet that follows your car for life.',
      },
      {
        q: 'Is it free to use?',
        a: 'Yes — Dynamic Garage is free during early access. Add your vehicles, track your mods and service history, and share your build page at no cost.',
      },
      {
        q: 'What kinds of vehicles can I add?',
        a: 'Any make or model — Corvette, Mustang, BMW, truck, daily driver, project car, motorcycle. The app is built for any vehicle you care about.',
      },
      {
        q: 'How do I add my first vehicle?',
        a: 'After signing up, click "Add Vehicle" on your dashboard. Give it a nickname (something fun, like "Red Devil" or "The Sled"), then fill in the year, make, model, and any other details. You can always edit or add more later — nothing is required upfront.',
      },
      {
        q: 'Do I need to fill in everything at once?',
        a: 'Not at all. Add what you know today and fill in the rest as you go. The Getting Started checklist on each vehicle\'s page will guide you through the key steps.',
      },
    ],
  },
  {
    title: '🔧 Mods & Service Records',
    items: [
      {
        q: 'What is a "mod"?',
        a: 'A mod is any modification, upgrade, or part you\'ve added to your vehicle. That includes intake systems, suspension, wheels, audio, tunes, cosmetic changes — anything you\'ve done to the car that isn\'t a routine maintenance item.',
      },
      {
        q: 'What goes in Service Records?',
        a: 'Service records are for maintenance and repairs — oil changes, tire rotations, brake jobs, inspections, fluid changes. Anything you do to keep the car running belongs here.',
      },
      {
        q: 'Can I attach receipts or invoices to a mod or service record?',
        a: 'Yes. When adding or editing a mod or service record, you\'ll see an option to attach a document. This links the receipt directly to that specific entry, so it\'s easy to find later.',
      },
      {
        q: 'Can I track how much I\'ve spent on modifications?',
        a: 'Yes. Add a cost when logging each mod and Dynamic Garage will total it up for you. The Insurance Package page shows a full breakdown of your declared mod values, which is useful when insuring an agreed-value or stated-value policy.',
      },
      {
        q: 'What currencies are supported?',
        a: 'USD, CAD, and GBP. You set the currency per vehicle in the vehicle settings — all amounts for that car will display in your chosen currency.',
      },
    ],
  },
  {
    title: '📁 Document Vault & Email Upload',
    items: [
      {
        q: 'What is the Document Vault?',
        a: 'The Document Vault is secure storage for any file related to your vehicle — receipts, manuals, inspection reports, title documents, photos of paperwork. You can upload files directly or email them in.',
      },
      {
        q: 'How do I upload documents?',
        a: 'Go to your vehicle\'s page and tap "Documents". You can drag and drop files or tap "Upload" to browse from your device. Supported file types include PDF, JPG, PNG, and HEIC.',
      },
      {
        q: 'How does email upload work?',
        a: 'Every vehicle has a unique email address — shown in the Document Vault. Forward any receipt, invoice, or photo to that address from your phone or computer and it will appear in your vault automatically within a minute or two. Great for snapping a receipt right at the shop and forwarding it on the spot.',
      },
      {
        q: 'Can I email multiple attachments at once?',
        a: 'Yes. Attach as many files as you like to a single email. Each attachment will be saved as a separate document in your vault.',
      },
      {
        q: 'Can documents be seen on my public build page?',
        a: 'Only if you choose to show them. Each document has a visibility toggle (the eye icon). By default, documents are private. Toggle it on to make a specific document visible on your public page — useful for showing buyers things like inspection certificates.',
      },
      {
        q: 'What file types are supported?',
        a: 'PDF, JPG, JPEG, PNG, HEIC, and WEBP. Files should be under 20 MB each.',
      },
    ],
  },
  {
    title: '🌐 Sharing & Privacy',
    items: [
      {
        q: 'How do I share my build?',
        a: 'Go to your vehicle\'s settings and turn on "Public Build Page". This creates a shareable link in the format dynamicgarage.app/share/... that anyone can open — no account required to view it.',
      },
      {
        q: 'What will people see on my public build page?',
        a: 'Your cover photo, vehicle details, mods list, service history, any documents you\'ve marked as visible, and your photo gallery. Sensitive information like your email address or insurance details is never shown publicly.',
      },
      {
        q: 'Can I turn off the public page at any time?',
        a: 'Yes. Toggle off "Public Build Page" in your vehicle settings and the link will immediately stop working. Your data stays saved — you\'re just hiding the public view.',
      },
      {
        q: 'What is the Community Gallery?',
        a: 'The Gallery at dynamicgarage.app/gallery shows builds from members who have opted in. Your vehicle must be set to Public AND have "Add to Community Gallery" turned on in settings. You can opt out at any time.',
      },
      {
        q: 'Can I share my whole garage (multiple vehicles)?',
        a: 'Yes. From your dashboard, click "Share" next to "Your Public Garage" to get a link that shows all your public vehicles in one place.',
      },
      {
        q: 'What is the QR code for?',
        a: 'Each vehicle has a downloadable QR code that links directly to its public build page. Print it, stick it on your car at a show, or include it in a for-sale listing — anyone who scans it sees your full build sheet instantly.',
      },
    ],
  },
  {
    title: '🔥 Community Props',
    items: [
      {
        q: 'What are Props?',
        a: 'Props are community votes — a way for members to give recognition to builds they admire. If you love someone\'s build, tap the flame icon on their public page to give them Props. The count shows on gallery cards and the build page.',
      },
      {
        q: 'Can anyone give Props?',
        a: 'Props are for verified, active members only — not anonymous visitors. To give Props, your account needs to be at least 14 days old and you need to have at least one mod, service record, or photo on a vehicle in your garage. This keeps the votes meaningful.',
      },
      {
        q: 'Why can\'t I give Props yet?',
        a: 'If you see a message when clicking Props, it will tell you exactly what\'s needed. Usually it\'s one of two things: your account is less than 14 days old, or you haven\'t added any content to a vehicle yet. Add a mod, service record, or photo to unlock Props.',
      },
      {
        q: 'Can I give Props to my own build?',
        a: 'No — you can\'t vote on your own build. Props only come from other members.',
      },
      {
        q: 'Can I remove Props I gave?',
        a: 'Yes. Tap the flame icon again on a build you\'ve already propped and it will be removed.',
      },
      {
        q: 'Will I be notified when I receive Props?',
        a: 'Yes. If your build receives 3 or more Props in a week, you\'ll get an email notification. We batch these to avoid spamming your inbox.',
      },
    ],
  },
  {
    title: '🏷️ Selling Your Vehicle',
    items: [
      {
        q: 'How do I list my car for sale?',
        a: 'Go to your vehicle\'s settings and turn on "Mark as For Sale". This adds a green FOR SALE badge to your public build page and makes the car filterable in the gallery. Buyers can reach out through the contact form on your listing.',
      },
      {
        q: 'What is the CARFAX option?',
        a: 'If your vehicle has a VIN saved, you can enable a CARFAX button on your listing. This gives potential buyers a direct link to purchase a vehicle history report for your car from CARFAX. It\'s a great trust signal for serious buyers.',
      },
      {
        q: 'Does Dynamic Garage handle payments or transactions?',
        a: 'No. Dynamic Garage helps you present your vehicle\'s history to buyers — the actual sale is between you and the buyer, handled however you prefer.',
      },
      {
        q: 'Can I share the build page link in a Craigslist or Facebook Marketplace ad?',
        a: 'Absolutely — that\'s one of the best uses. Your build page shows your full service history and mod list in a professional format that most private listings never have. It builds buyer confidence.',
      },
    ],
  },
  {
    title: '🛡️ Insurance & Vehicle Value',
    items: [
      {
        q: 'What is the Insurance Package?',
        a: 'The Insurance Package is a printable summary of your vehicle\'s mods and their declared values, plus your stated vehicle value and insurance expiry date. It\'s designed to help you communicate your build\'s value to an insurance adjuster or broker, especially if you carry agreed-value or stated-value coverage.',
      },
      {
        q: 'What is "Agreed / Stated Vehicle Value"?',
        a: 'This is the value you and your insurer agree the vehicle is worth — the amount they would pay if it were totalled. It\'s separate from the car\'s market value. Enter the amount your current policy covers the vehicle for.',
      },
      {
        q: 'Will Dynamic Garage email me when my insurance expires?',
        a: 'Yes. If you enter your insurance expiry date in vehicle settings, we\'ll send you a reminder 7 days before it expires so you have time to gather your documents for renewal.',
      },
      {
        q: 'Are recall alerts automatic?',
        a: 'If you have a VIN saved and recall alerts are turned on (the default), Dynamic Garage checks the NHTSA database weekly and emails you if any new open recalls are found for your vehicle.',
      },
    ],
  },
  {
    title: '👤 Account & Settings',
    items: [
      {
        q: 'How do I change my password?',
        a: 'Go to dynamicgarage.app/forgot-password and enter your email address. You\'ll receive a link to set a new password.',
      },
      {
        q: 'Can I delete a vehicle?',
        a: 'Yes. Open the vehicle\'s settings page and scroll to the bottom. You\'ll find a "Delete This Car" button. This permanently removes the vehicle and all its data — mods, service records, documents, and photos. This cannot be undone.',
      },
      {
        q: 'Is my data private?',
        a: 'Yes. Only data you explicitly choose to make public is visible to others. Your email address, insurance details, VIN (unless you\'ve turned on the VIN Decoder option), and financial information are never shared publicly.',
      },
      {
        q: 'I found a bug or have a suggestion. How do I report it?',
        a: 'Use the Feedback button at the bottom of any page inside your garage. We read every submission and use it to improve the app.',
      },
    ],
  },
]

export default function HelpPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <PublicNav />

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56,
            background: 'var(--red-dim)', border: '1px solid var(--red-glow)',
            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <HelpCircle size={26} color="var(--red)" />
          </div>
          <p className="page-eyebrow" style={{ marginBottom: '0.4rem' }}>Support</p>
          <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1, marginBottom: '0.75rem' }}>
            HELP &amp; FAQ
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 500, margin: '0 auto' }}>
            Everything you need to know about using Dynamic Garage. Can&apos;t find your answer? Use the Feedback button in your garage.
          </p>
        </div>

        {/* Quick links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.6rem',
          marginBottom: '3rem',
        }}>
          {sections.map(s => (
            <a
              key={s.title}
              href={`#${s.title}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.7rem 1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                fontSize: '0.82rem', fontWeight: 600,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'border-color 150ms, color 150ms',
              }}
              className="help-quicklink"
            >
              <ChevronRight size={13} color="var(--red)" />
              {s.title}
            </a>
          ))}
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {sections.map(section => (
            <div key={section.title} id={section.title}>
              <h2 style={{
                fontFamily: "'Barlow Condensed'",
                fontSize: '1.5rem', fontWeight: 900,
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                paddingBottom: '0.6rem',
                borderBottom: '2px solid var(--border-subtle)',
              }}>
                {section.title}
              </h2>
              <HelpAccordion items={section.items} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: '4rem',
          padding: '2rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          textAlign: 'center',
        }}>
          <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Still have questions?
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Use the Feedback button inside your garage — we read every message.
          </p>
          <Link href="/register" className="btn-primary" style={{ display: 'inline-flex', marginRight: '0.75rem' }}>
            Get Started Free
          </Link>
          <Link href="/gallery" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)',
            textDecoration: 'none', padding: '0.65rem 1.25rem',
            border: '1px solid var(--border-default)', borderRadius: 8,
          }}>
            Browse the Gallery
          </Link>
        </div>
      </div>

      <PublicFooter />

      <style>{`
        .help-quicklink:hover { border-color: var(--border-default) !important; color: var(--text-primary) !important; }
      `}</style>
    </div>
  )
}
