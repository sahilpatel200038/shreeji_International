import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { sectionContainer } from "@/lib/utils";

const faqs = [
  {
    question: "Which countries does Shreeji International Courier deliver to?",
    answer:
      "We deliver to 100+ countries worldwide including USA, UK, Canada, Australia, UAE, Germany, Singapore, New Zealand, and across Europe, Asia, and the Middle East. Contact us to check availability for your specific destination.",
  },
  {
    question: "How long does international delivery take from Ahmedabad?",
    answer:
      "Delivery typically takes 4–7 business days to major destinations like USA, UK, Canada, and Australia. Express options are available for faster delivery. Delivery time may vary based on destination and customs processing.",
  },
  {
    question: "Do you offer free pickup in Ahmedabad?",
    answer:
      "Yes! We offer completely free door pickup from your home or office in Nikol, Naroda, Bapunagar, Gota, and all across Ahmedabad. Simply call us or WhatsApp us at +91 99095 66565 to schedule a convenient time.",
  },
  {
    question: "Can I send a student parcel or food items internationally?",
    answer:
      "Absolutely. We specialize in student parcel delivery including homemade food, tiffin, medicines, sweets, and personal care items. We handle these shipments with extra care from Ahmedabad to destinations worldwide.",
  },
  {
    question: "How much does international courier from Ahmedabad cost?",
    answer:
      "Pricing depends on the weight, dimensions, and destination of your parcel. We offer transparent, competitive rates with no hidden charges. Call us at +91 99095 66565 or WhatsApp us for a free instant quote.",
  },
  {
    question: "Do you assist with customs clearance?",
    answer:
      "Yes. We handle all customs documentation and clearance procedures to ensure your shipment reaches its destination smoothly and without unnecessary delays.",
  },
  {
    question: "How can I track my international shipment?",
    answer:
      "Once your shipment is booked, we provide you with a tracking number. You can track your parcel through our carrier partner's website, or call our support team at +91 99095 66565 for real-time updates on your delivery.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className={sectionContainer}>
      <SectionHeading
        eyebrow="FAQs"
        title="Frequently Asked Questions"
        description="Everything you need to know about shipping internationally from Ahmedabad with Shreeji International Courier."
      />
      <div className="mx-auto space-y-3">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-2xl border border-foreground/10 bg-background/80 overflow-hidden"
          >
            <button
              className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-foreground transition hover:text-brand-red"
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
            >
              <span>{faq.question}</span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-muted transition-transform duration-300 ${open === idx ? "rotate-180 text-brand-red" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {open === idx && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-7 text-muted">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
