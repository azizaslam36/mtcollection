import type { Metadata } from "next";
import { Instagram, MapPin, Phone } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Layout";
import { buttonClasses } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with M&T Collection via WhatsApp, Instagram or our Delhi location.",
};

export default function ContactPage() {
  return (
    <Container className="flex flex-col gap-10 py-14">
      <SectionHeading
        eyebrow="Get in touch"
        title="Contact Us"
        description="Real contact details only — reach out via WhatsApp or Instagram, or find us at our Delhi location."
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <a
          href="https://wa.me/919911999482"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col gap-3 rounded-card border border-mist bg-white p-6 transition-shadow hover:shadow-card"
        >
          <Phone className="h-6 w-6 text-marigold-dark" aria-hidden="true" />
          <h3 className="font-sans font-semibold">WhatsApp</h3>
          <p className="text-sm text-ink-soft">+91 99119 99482</p>
        </a>

        <a
          href="https://www.instagram.com/mtcollection.01"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col gap-3 rounded-card border border-mist bg-white p-6 transition-shadow hover:shadow-card"
        >
          <Instagram className="h-6 w-6 text-marigold-dark" aria-hidden="true" />
          <h3 className="font-sans font-semibold">Instagram</h3>
          <p className="text-sm text-ink-soft">@mtcollection.01</p>
        </a>

        <div className="flex flex-col gap-3 rounded-card border border-mist bg-white p-6">
          <MapPin className="h-6 w-6 text-marigold-dark" aria-hidden="true" />
          <h3 className="font-sans font-semibold">Location</h3>
          <p className="text-sm text-ink-soft">
            Jamia Nagar, Okhla, New Delhi 110025
          </p>
        </div>
      </div>

      <a
        href="https://wa.me/919911999482"
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses("primary", "lg", "self-start")}
      >
        Message us on WhatsApp
      </a>
    </Container>
  );
}
