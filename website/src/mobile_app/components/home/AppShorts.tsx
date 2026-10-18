import { Link } from "react-router-dom";

export interface ShortItem {
  id: string;
  title: string;
  views: string;
  image: string;
}

const DEFAULT_SHORTS: ShortItem[] = [
  {
    id: "1",
    title: "Mastering the transition between technical and decorative finishes",
    views: "2.1m views",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    title: "Inside Melbourne's latest sustainable luxury home build",
    views: "1.4m views",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    title: "How to inspect structural timber before signing renovation quotes",
    views: "890k views",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18f156f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "4",
    title: "Top 7 smart energy installations yielding 20%+ ROI",
    views: "640k views",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
  },
];

interface AppShortsProps {
  title?: string;
  items?: ShortItem[];
  seeAllPath?: string;
}

export default function AppShorts({
  title = "Shorts",
  items = DEFAULT_SHORTS,
  seeAllPath = "/blogs",
}: AppShortsProps) {
  return (
    <section className="space-y-3.5 pt-2">
      <h2 className="text-xl font-medium text-[#342511] tracking-tight">{title}</h2>

      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        {items.map((short) => (
          <Link key={short.id} to={seeAllPath} className="group block">
            <div className="aspect-[2/3] w-full overflow-hidden rounded-2xl bg-neutral-200">
              <img
                src={short.image}
                alt={short.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h4 className="mt-2 truncate text-sm font-medium text-[#342511]">{short.title}</h4>
            <p className="mt-0.5 text-sm text-[#8B6F54]">{short.views}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}