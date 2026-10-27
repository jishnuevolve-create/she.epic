export const site = {
  name: "She.Epics Photography",
  description:
    "Honest emotions. Beautifully told stories. Wedding photography and films that feel like you.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  logo: "", // Official logo path; preserve original proportions.
  email: "",
  phone: "",
  address: "",
  instagram: "",
  whatsapp: "",
  hero: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=85",
};
export const navigation = [
  { href: "/portfolio", label: "Our stories" },
  { href: "/about", label: "The studio" },
  { href: "/services", label: "What we do" },
  { href: "/films", label: "Films" },
  { href: "/contact", label: "Contact" },
];
export const testimonials: { quote: string; attribution: string }[] = [];
