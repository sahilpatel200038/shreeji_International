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
    title: "International Courier Service",
    description: "Ship parcels and packages from Ahmedabad to 100+ countries with safe door-to-door delivery. We serve major destinations including USA, UK, Canada, Australia, and UAE.",
    icon: Plane,
  },
  {
    title: "Express Delivery",
    description: "Time-sensitive shipment? Our express courier from Ahmedabad ensures priority handling and delivery in 4–7 business days to any major international destination.",
    icon: Rocket,
  },
  {
    title: "Document Courier",
    description: "Send visa papers, legal documents, educational certificates, and business paperwork internationally with full confidentiality and end-to-end tracking.",
    icon: FileText,
  },
  {
    title: "Student Parcel Service",
    description: "Sending tiffin, homemade food, medicines, or personal items to your student studying abroad? We handle student parcels from Ahmedabad with extra care and love.",
    icon: PackageOpen,
  },
  {
    title: "Door-to-Door Courier",
    description: "Free pickup from your home or office in Ahmedabad Nikol, Naroda, Bapunagar, Gota & more. We deliver straight to your recipient's doorstep worldwide.",
    icon: ShoppingBag,
  },
  {
    title: "Commercial Air & Sea Cargo Shipping",
    description: "Reliable business cargo and commercial goods shipping from India with full customs clearance assistance and competitive pricing for bulk shipments.",
    icon: ShieldCheck,
  },
];

export const stats = [
  { label: "Years of Service", value: 5, suffix: "+" },
  { label: "Countries Delivered", value: 100, suffix: "+" },
  { label: "Happy Customers", value: 10, suffix: "k+" },
  { label: "Safe Delivery Rate", value: 99, suffix: "%" },
];

export const reasons: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Fast International Delivery",
    description: "Shipments from Ahmedabad typically reach USA, UK, Canada & Australia in 4–7 business days. Express options available for urgent deliveries.",
    icon: Clock3,
  },
  {
    title: "Safe & Secure Packaging",
    description: "Every parcel is carefully packed and handled to ensure it arrives at its destination in perfect condition no damage, no compromise.",
    icon: Box,
  },
  {
    title: "Affordable & Transparent Pricing",
    description: "Competitive, honest rates for personal and business shipping. What we quote is what you pay no surprises, no hidden charges.",
    icon: Wallet,
  },
  {
    title: "Worldwide Delivery Network",
    description: "We deliver to 100+ countries through a trusted global network, with reliable last-mile partners ensuring safe delivery at every destination.",
    icon: Globe2,
  },
  {
    title: "Free Door Pickup",
    description: "No need to travel we offer free doorstep pickup across Ahmedabad and Gandhinagar for quick, secure, and stress-free international shipping.",
    icon: Radar,
  },
  {
    title: "Dedicated Customer Support",
    description: "Have a question about your shipment? Our friendly team is available Mon–Sat, 10AM–8PM to assist you by phone, WhatsApp, or email.",
    icon: Headset,
  },
];

export const testimonials = [
  {
    name: "Jasmin Valani",
    role: "Customer India to UK",
    quote:
      "Highly professional and reliable service. Our shipment from Ahmedabad to the UK was delivered within 4–5 days. Fast delivery, excellent communication, and a completely seamless experience from pickup to delivery.",
  },
  {
    name: "Purvi Patel",
    role: "Customer India to USA",
    quote:
      "Outstanding service and professional packaging. We received the parcel safely and were genuinely impressed by the care taken at every step. We will definitely use Shreeji again for all our international courier needs.",
  },
  {
    name: "Hiral Khatri",
    role: "Customer India to Canada",
    quote:
      "Excellent experience with Shreeji International Courier! The free home pickup in Ahmedabad made everything so convenient, and the door-to-door delivery to Canada was smooth, on time, and completely hassle-free.",
  },
];
