import { motion } from "framer-motion";

const stats = [
  { value: "3.5", label: "Years Experience" },
  { value: "23", label: "Project Challenge" },
  { value: "830+", label: "Positive Reviews" },
  { value: "100K", label: "Trusted Students" },
];

export function AboutUsSection() {
  return (
    <section id="about" className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 md:px-8 lg:px-0">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="max-w-2xl space-y-6">
          <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)] shadow-sm transition-colors duration-300">
            How It Started
          </span>
          <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl">
            Our Dream is Global Learning Transformation
          </h2>
          <p className="max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            We create premium learning experiences that empower students across the globe with trusted guidance, modern pedagogy,
            and a vision for future-ready education. Our mission is to make world-class learning accessible, inspiring, and transformational.
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
              src="/hero-banner.png"
              alt="Premium learning transformation"
              className="h-[340px] w-full object-cover object-center sm:h-[400px]"
              loading="lazy"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-[1.6rem] border border-[var(--border)] bg-[var(--surface)]/95 p-5 shadow-lg backdrop-blur-sm transition-colors duration-300">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                Global education excellence
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
                Designed for ambitious learners, our programs deliver inspiring guidance, measurable progress, and real-world outcomes.
              </p>
            </div>
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
