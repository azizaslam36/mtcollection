import { ShieldCheck, Tags, RefreshCcw, Store } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Layout";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trusted platforms only",
    description:
      "Every affiliate pick links out to established platforms like Flipkart and Myntra — you check out where you already trust.",
  },
  {
    icon: Tags,
    title: "Curated, not dumped",
    description:
      "We don't list everything. Products are chosen one at a time, so browsing stays quick.",
  },
  {
    icon: RefreshCcw,
    title: "Regularly refreshed",
    description:
      "The catalog is updated as new deals come in, rather than sitting static.",
  },
  {
    icon: Store,
    title: "Some, self-branded",
    description:
      "Alongside affiliate finds, we also offer a few products of our own.",
  },
];

export function WhyMt() {
  return (
    <section className="py-14">
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Why M&T Collection"
          title="Built for quick, confident browsing"
          align="center"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-start gap-3 rounded-card border border-mist bg-white p-5"
            >
              <span className="rounded-tag bg-mist p-2 text-ink">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-sans font-semibold text-ink">
                {title}
              </h3>
              <p className="text-sm text-ink-soft">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
