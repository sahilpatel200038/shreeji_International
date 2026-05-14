import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { stats } from "@/data/site";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const startedAt = performance.now();
    const tick = (time: number) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      setCount(Math.floor(value * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className="text-3xl font-bold md:text-4xl">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.09 }}
            className="glass-card rounded-2xl p-6"
          >
            <Counter value={item.value} suffix={item.suffix} />
            <p className="mt-2 text-sm text-muted">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
