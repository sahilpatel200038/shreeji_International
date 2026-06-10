import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pb-16 pt-28 md:px-8 md:pb-24 md:pt-32">
      <div className="hero-gradient absolute inset-0 -z-10" />
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 lg:flex-row lg:justify-center lg:gap-14">
        <div className="mx-auto w-full max-w-2xl space-y-8 text-center lg:mx-0 lg:max-w-xl lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Global Express Network
            </span>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-tight text-white md:text-6xl">
              Fast & Reliable International Courier Services
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/80">
              Ship documents, parcels, and cargo to destinations worldwide with transparent tracking, secure handling,
              and premium support.
            </p>
          </motion.div>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="flex flex-wrap justify-center gap-3 lg:justify-start"
          >
            <Button href="#tracking">Track Shipment</Button>
            <Button href="#contact" variant="secondary">
              Get Quote
            </Button>
          </motion.div> */}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          // className="glass-card relative w-full max-w-xl shrink-0 overflow-hidden rounded-3xl p-6 lg:mx-0"
        >
          {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,120,80,0.25),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.22),transparent_40%)]" /> */}
          <div className="absolute inset-0 " />
          <motion.div className="relative space-y-5">
            {/* <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Shreeji logo" width={36} height={36} />
              <div>
                <p className="text-sm font-semibold text-white">Shreeji Live Route</p>
                <p className="text-xs text-white/70">Mumbai to London in transit</p>
              </div>
            </div> */}
            {/* <div className="relative mx-auto aspect-square w-full max-w-[min(100%,18rem)] overflow-hidden rounded-2xl border border-white/20 bg-white shadow-inner">
              <Image
                src="/hero-banner.png"
                alt="Global logistics network with cargo plane, truck, forklift, and world globe"
                fill
                className="object-contain object-center p-3"
                sizes="(max-width: 1024px) 90vw, 288px"
                priority
              />
         />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 380 180" fill="none">
                <path d="M45 100 C130 40, 230 40, 335 95" stroke="url(#route)" strokeWidth="2.8" strokeDasharray="7 8" />
                <defs>
                  <linearGradient id="route" x1="45" y1="100" x2="335" y2="95" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffd4cb" />
                    <stop offset="1" stopColor="#ff4f3f" />
                  </linearGradient>
                </defs>
              </svg>
            </div> */}
            {/* <div className="relative h-52 rounded-2xl border border-white/20 bg-black/20"> */}
            <div className="relative">
              <motion.img
                className="w-full"
                src="/international-courier-services-500x500.png"
                alt="Global coverage"
                width={500}
                height={206}
                animate={{ y: [0, -14, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
