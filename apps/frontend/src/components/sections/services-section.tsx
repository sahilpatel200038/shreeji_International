import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { serviceItems } from "@/data/site";
import { sectionContainer } from "@/lib/utils";

export function ServicesSection() {
  return (
    <section id="services" className={sectionContainer}>
      <SectionHeading
        eyebrow="Our Services"
        title="International Courier Services from Ahmedabad"
        description="From personal parcels to commercial cargo we deliver safely to 100+ countries with free pickup, expert handling, and full support."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {serviceItems.map((service, idx) => (
          <motion.article
            key={service.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.06, duration: 0.45 }}
            className="service-card group rounded-2xl p-[1px]"
          >
            <div className="h-full rounded-2xl bg-background/90 p-6">
              <div className="mb-4 inline-flex rounded-xl border border-brand-red/20 bg-brand-red/10 p-3 text-brand-red">
                <service.icon size={20} />
              </div>
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 text-muted">{service.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
