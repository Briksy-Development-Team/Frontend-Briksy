export const SERVICE_CATEGORIES = [
  { slug: "landscapers", label: "Landscappers" },
  { slug: "concreter", label: "Concreter" },
  { slug: "fencing", label: "Fencing" },
  { slug: "mortgage-brokers", label: "Mortgage Brokers" },
  { slug: "conveyancers", label: "Conveyancers" },
  { slug: "building-and-pest", label: "Building and Pest" },
] as const;

export type ProfessionalCategoryLabel = (typeof SERVICE_CATEGORIES)[number]["label"];

export const serviceSlugForLabel = (label: string) =>
  SERVICE_CATEGORIES.find((category) => category.label === label)?.slug;
