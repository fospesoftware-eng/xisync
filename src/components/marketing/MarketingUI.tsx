import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Reveal } from './premium/Reveal';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- Eyebrow pill ---------- */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3.5 py-1 text-xs font-semibold text-ink-600 shadow-premium-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-xisync-blue-600 to-xisync-green-500" />
      {children}
    </span>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: ReactNode; subtitle?: string }) {
  return (
    <Reveal className="mx-auto mb-14 max-w-3xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-ink-950 md:text-4xl lg:text-[2.75rem]">{title}</h2>
      {subtitle && <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-500 md:text-lg">{subtitle}</p>}
    </Reveal>
  );
}

/* ---------- Inner page hero ---------- */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  primaryHref = '/demo',
  secondaryCta,
  secondaryHref = '/pricing',
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  primaryCta?: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="absolute inset-0 bg-wash" />
      <div className="absolute inset-0 bg-grid-subtle" />
      <div className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-xisync-blue-200/50 blur-[120px] animate-drift" />
      <div className="absolute -top-20 -right-40 h-[26rem] w-[26rem] rounded-full bg-xisync-green-200/60 blur-[120px] animate-drift" style={{ animationDelay: '-7s' }} />

      <div className="container-custom relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex justify-center"
          >
            <Eyebrow>{eyebrow}</Eyebrow>
          </motion.div>
          <motion.h1
            className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-ink-950 md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-500 md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            {subtitle}
          </motion.p>
          {(primaryCta || secondaryCta) && (
            <motion.div
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
            >
              {primaryCta && (
                <Link
                  to={primaryHref}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-xisync-blue-800 via-xisync-cyan-600 to-xisync-green-500 px-7 py-3.5 text-sm font-semibold text-white shadow-premium-md transition-all duration-200 hover:shadow-premium-lg hover:opacity-95"
                >
                  {primaryCta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              )}
              {secondaryCta && (
                <Link
                  to={secondaryHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-200 bg-white px-7 py-3.5 text-sm font-semibold text-ink-900 transition-all duration-200 hover:border-ink-300 hover:bg-ink-50"
                >
                  {secondaryCta}
                </Link>
              )}
            </motion.div>
          )}
          {children && (
            <motion.div
              className="mt-14"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42, ease: EASE }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export type Faq = { q: string; a: string };

export function FAQSection({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={item.q} delay={i * 0.06} y={16}>
            <div className="mb-3 rounded-2xl border border-ink-200 bg-white p-5 transition-all duration-300 hover:border-ink-300 card-lift">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="text-base font-semibold text-ink-950">{item.q}</span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-600 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-sm leading-relaxed text-ink-500">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ---------- Check list item ---------- */
export function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-ink-600">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-xisync-green-100">
        <svg viewBox="0 0 12 12" className="h-3 w-3 text-xisync-green-600" fill="none">
          <path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{children}</span>
    </li>
  );
}
