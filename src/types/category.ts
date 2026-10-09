export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;

  /**
   * REQUIRED data-provenance flag — same meaning as Product.isDemo.
   * false = a real category backed by actual M&T Collection products.
   * true  = a demo category that exists only to exercise the UI
   *         (filters, category grid, empty states) with more variety
   *         than the current real catalog provides.
   */
  isDemo: boolean;
}
