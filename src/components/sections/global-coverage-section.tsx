import { SectionHeading } from "@/components/ui/section-heading";
import { coverageMapConfig } from "@/data/coverage-map";
import { sectionContainer } from "@/lib/utils";

const { width: W, height: H } = coverageMapConfig;

export function GlobalCoverageSection() {
  return (
    <section id="coverage" className={sectionContainer}>
      <div className="w-full min-w-0 items-start grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionHeading
          eyebrow="Global Coverage"
          title="Connected worldwide delivery network"
          description="Intelligent courier lanes across major trade regions and last-mile partners."
        />
        {/* <div className="glass-card overflow-hidden rounded-2xl border border-foreground/10 shadow-[0_24px_60px_rgba(15,17,21,0.08)] sm:rounded-3xl"> */}
        <div className="overflow-hidden box-shadow-none border-none glass-card map-card">
          <div
            // className="relative mx-auto w-full max-w-full bg-brand-beige/20 dark:bg-foreground/4"
            className="relative mx-auto w-full max-w-full"
            style={{ aspectRatio: `${W} / ${H}` }}
          >
            <img
              src={coverageMapConfig.imageSrc}
              alt={coverageMapConfig.alt}
              width={W}
              height={H}
              className="h-auto w-full object-contain object-center select-none"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
