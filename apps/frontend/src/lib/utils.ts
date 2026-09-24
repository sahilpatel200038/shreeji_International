import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const sectionContainer = "mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-16";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
