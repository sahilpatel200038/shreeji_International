import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "@/data/site";
import { sectionContainer } from "@/lib/utils";

function Counter({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    const duration = 1200;
    const startedAt = performance.now();
    const tick = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      setCount(Math.floor(value * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [active, value]);

  return (
    <span className="text-3xl font-bold md:text-4xl">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px -80px 0px" });

  return (
    <section className={sectionContainer}>
      <div ref={ref} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.09 }}
            className="glass-card rounded-2xl p-6"
          >
            <Counter value={item.value} suffix={item.suffix} active={isInView} />
            <p className="mt-2 text-sm text-muted">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
