import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ChevronRight } from "lucide-react";
import { getProductBySlug, getRelatedProducts, getAllProducts } from "@/data/products";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductPrice } from "@/components/products/ProductPrice";
import { ProductBadge, PlatformBadge } from "@/components/products/ProductBadge";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Layout";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Best-effort pre-render: works against either the API or local
  // data. If the API is unreachable at build time (e.g. building the
  // frontend before the backend is deployed), this returns [] and
  // Next.js renders these routes on-demand instead of failing the build.
  try {
    const products = await getAllProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.title,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.image.startsWith("http") ? [product.image] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const images = product.images?.length ? product.images : [product.image];
  const related = await getRelatedProducts(product, 4);

  return (
    <Container className="flex flex-col gap-10 py-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-ink-soft">
        <Link href="/" className="hover:text-marigold-dark">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <Link href="/products" className="hover:text-marigold-dark">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <Link
          href={`/category/${product.categorySlug}`}
          className="hover:text-marigold-dark"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={images} title={product.title} />

        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <ProductBadge product={product} />
            {product.isDemo ? <Tag tone="ink">Demo product</Tag> : null}
            <PlatformBadge platform={product.platform} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl">{product.title}</h1>
          </div>

          {product.rating ? (
            <div className="flex items-center gap-1 text-sm text-ink-soft">
              <Star className="h-4 w-4 fill-marigold text-marigold" aria-hidden="true" />
              <span>{product.rating.toFixed(1)}</span>
              {product.reviewCount ? <span>({product.reviewCount} reviews)</span> : null}
            </div>
          ) : null}

          <ProductPrice
            price={product.price}
            originalPrice={product.originalPrice}
            size="lg"
          />

          <p className="text-ink-soft">{product.description}</p>

          {product.tags.length ? (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Tag key={tag} tone="mist">
                  {tag}
                </Tag>
              ))}
            </div>
          ) : null}

          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="mt-2 inline-flex w-full items-center justify-center rounded-tag bg-ink px-6 py-3.5 text-base font-medium text-paper transition-colors duration-200 hover:bg-marigold hover:text-ink sm:w-auto"
          >
            Check Deal on {product.platform}
          </a>
        </div>
      </div>

      {related.length > 0 ? (
        <div className="flex flex-col gap-6 border-t border-mist pt-10">
          <h2 className="text-2xl">Related products</h2>
          <ProductGrid products={related} />
        </div>
      ) : null}
    </Container>
  );
}
