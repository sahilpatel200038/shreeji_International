import type { LucideIcon } from "lucide-react";
import {
  Plane,
  Rocket,
  PackageOpen,
  FileText,
  ShoppingBag,
  ShieldCheck,
  Clock3,
  Box,
  Radar,
  Wallet,
  Globe2,
  Headset,
} from "lucide-react";

export const serviceItems: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "International Shipping",
    description: "Door-to-door worldwide parcel movement with end-to-end reliability.",
    icon: Plane,
  },
  {
    title: "Express Delivery",
    description: "Time-critical delivery lanes with priority handling and dispatch.",
    icon: Rocket,
  },
  {
    title: "Air Cargo",
    description: "Secure high-volume cargo movement for enterprise-grade logistics.",
    icon: PackageOpen,
  },
  {
    title: "Document Courier",
    description: "Confidential document movement with chain-of-custody safeguards.",
    icon: FileText,
  },
  {
    title: "E-commerce Logistics",
    description: "Order fulfillment logistics designed for growing brands.",
    icon: ShoppingBag,
  },
  {
    title: "Customs Clearance",
    description: "Compliance-first customs workflows to reduce international delays.",
    icon: ShieldCheck,
  },
];

export const stats = [
  { label: "Countries Served", value: 50, suffix: "+" },
  { label: "Deliveries Completed", value: 10, suffix: "k+" },
  { label: "Support Availability", value: 24, suffix: "/7" },
  { label: "Safe Delivery Rate", value: 99, suffix: "%" },
];

export const reasons: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Fast Delivery",
    description: "Optimized lanes and automated routing reduce transit time.",
    icon: Clock3,
  },
  {
    title: "Secure Packaging",
    description: "Specialized handling and packaging protocols for every shipment.",
    icon: Box,
  },
  // {
  //   title: "Real-time Tracking",
  //   description: "Live milestone visibility with proactive status updates.",
  //   icon: Radar,
  // },
  {
    title: "Affordable Pricing",
    description: "Transparent plans built for both personal and business shipping.",
    icon: Wallet,
  },
  {
    title: "Worldwide Network",
    description: "A connected global network across key trade corridors.",
    icon: Globe2,
  },
  {
    title: "Customer Support",
    description: "Dedicated logistics support with quick human assistance.",
    icon: Headset,
  },
];

export const testimonials = [
  {
    name: "Jasmin Valani",
    role: "UK",
    quote:
      "Highly professional and reliable service. Our shipment from India to the UK was delivered within 4–5 days. Fast delivery, excellent communication, and a seamless experience throughout.",
  },
  {
    name: "Purvi Patel",
    role: "USA",
    quote:
      "Outstanding service and professional packaging. We received the parcel safely and were impressed with the care taken throughout the process. We look forward to working with you again in the future.",
  },
  {
    name: "Hiral Khatri",
    role: "Canada",
    quote:
      "I had a great experience with Shreeji International Courier service! The free pickup made the process super convenient, and the door-to-door delivery was smooth and hassle-free.",
  },
];
