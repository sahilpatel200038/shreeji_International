import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const heroSection = "relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pt-24 pb-12 md:px-8 md:pt-28 md:pb-20";
export const heroSpanText = "inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
