import { cn } from "@/lib/utils";

type TagTone = "marigold" | "pine" | "ink" | "mist";

const toneClasses: Record<TagTone, string> = {
  marigold: "bg-marigold text-ink",
  pine: "bg-pine text-paper",
  ink: "bg-ink text-paper",
  mist: "bg-mist text-ink-soft",
};

/**
 * Signature element. A small notched "price tag" shape (cut corner +
 * punched hole, see .tag-notch in globals.css) used for discount
 * badges, section eyebrows, and platform labels — anything that
 * reads as "a tag on a product" in this deal-discovery product.
 */
export function Tag({
  children,
  tone = "marigold",
  className,
}: {
  children: React.ReactNode;
  tone?: TagTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "tag-notch inline-flex items-center px-2.5 py-1 pr-4 text-xs font-sans font-semibold uppercase tracking-wide",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
