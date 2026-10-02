export const SERVICE_CATEGORIES = [
  { slug: "landscapers", label: "Landscapers" },
  { slug: "concreter", label: "Concreter" },
  { slug: "fencing", label: "Fencing" },
  { slug: "mortgage-brokers", label: "Mortgage Brokers" },
  { slug: "conveyancers", label: "Conveyancers" },
  { slug: "building-and-pest", label: "Building & Pest" },
] as const;

export type ServiceCategory = { slug: string; label: string; name?: string };
export type ProfessionalCategoryLabel = (typeof SERVICE_CATEGORIES)[number]["label"];

export const serviceSlugForLabel = (label: string, categories: readonly ServiceCategory[] = SERVICE_CATEGORIES) =>
  categories.find((category) => category.label.toLowerCase() === label.toLowerCase())?.slug;
