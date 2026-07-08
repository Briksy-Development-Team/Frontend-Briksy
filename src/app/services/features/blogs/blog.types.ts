export type BlogParagraph = {
  heading?: string;
  content: string;
  image?: string; // optional inline image URL for this paragraph
};

export type Blog = {
  id: number;
  title: string;
  name: string; // author name / display name
  slug: string;
  cover_image?: string;
  paragraphs: BlogParagraph[];
  status: "draft" | "published" | "archived";
  created_at?: string;
  updated_at?: string;
};

export type BlogFormValues = {
  title: string;
  name: string;
  slug: string;
  cover_image?: string;
  paragraphs: BlogParagraph[];
  status: "draft" | "published" | "archived";
};
