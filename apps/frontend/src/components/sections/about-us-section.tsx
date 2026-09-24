import { motion } from "framer-motion";
import { sectionContainer } from "@/lib/utils";

const stats = [
  // { value: "5+", label: "Years of Service" },
  { value: "24/7", label: "Support Availability" },
  { value: "100+", label: "Countries Delivered" },
  { value: "10k+", label: "Happy Customers" },
  { value: "99%", label: "Safe Delivery Rate" },
];

export function AboutUsSection() {
  return (
    <section id="about" className={`${sectionContainer} lg:px-0`}>
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="max-w-2xl space-y-6">
          <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)] shadow-sm transition-colors duration-300">
            Trusted Since 2018
          </span>
          <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl">
            Ahmedabad&apos;s Trusted International Courier Service
          </h2>
          <p className="max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            Founded in Nikol, Ahmedabad, Shreeji International Courier was built on one promise
            your shipment is our responsibility. For over 5 years, we have helped families, students,
            and businesses send parcels, documents, and Commercial air & sea cargo shipping to 100+ countries worldwide.
            We provide free door pickup across Ahmedabad, secure packaging, transparent pricing,
            and personal support at every step because every shipment deserves to be treated with care.
          </p>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85 }}
            className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card-bg)] shadow-[0_28px_90px_rgba(8,10,15,0.08)] transition-colors duration-300"
          >
            <div className="absolute -left-10 top-10 h-28 w-28 rounded-full bg-brand-red/10 blur-3xl" />
            <div className="absolute -right-10 top-8 h-24 w-24 rounded-full bg-brand-orange/10 blur-3xl" />
            <img
              src="/about.png"
              alt="Shreeji International Courier trusted global shipping and logistics services from Ahmedabad, India"
              className="h-[340px] w-full object-cover object-center sm:h-[400px]"
              loading="lazy"
              width="800"
              height="400"
            />
            {/* <div className="absolute inset-x-4 bottom-4 rounded-[1.6rem] border border-[var(--border)] bg-[var(--surface)]/95 p-5 shadow-lg backdrop-blur-sm transition-colors duration-300">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                Global education excellence
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
                Designed for ambitious learners, our programs deliver inspiring guidance, measurable progress, and real-world outcomes.
              </p>
            </div> */}
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-colors duration-300"
              >
                <p className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
