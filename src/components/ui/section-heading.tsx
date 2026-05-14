import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  rightSlot?: ReactNode;
}

export function SectionHeading({ eyebrow, title, description, rightSlot }: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl space-y-3">
        <span className="inline-flex rounded-full border border-brand-red/30 bg-brand-red/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-red">
          {eyebrow}
        </span>
        <h2 className="text-balance text-3xl font-bold leading-tight text-foreground md:text-5xl">
          {title}
        </h2>
        {description ? <p className="text-base text-muted md:text-lg">{description}</p> : null}
      </div>
      {rightSlot}
    </div>
  );
}
