import { Link, useNavigate } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";

export interface ShortItem {
  id: string;
  title: string;
  views: string;
  image: string;
  tag: string;
}

const DEFAULT_SHORTS: ShortItem[] = [
  {
    id: "1",
    title: "Mastering the transition between technical and decorative finishes",
    views: "2.1m views",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    tag: "Design",
  },
  {
    id: "2",
    title: "Inside Melbourne's latest sustainable luxury home build",
    views: "1.4m views",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    tag: "Architecture",
  },
  {
    id: "3",
    title: "How to inspect structural timber before signing renovation quotes",
    views: "890k views",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb18f156f?auto=format&fit=crop&w=600&q=80",
    tag: "Trades",
  },
  {
    id: "4",
    title: "Top 7 smart energy installations yielding 20%+ ROI",
    views: "640k views",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    tag: "Tips",
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
  const navigate = useNavigate();

  return (
    <section className="space-y-3.5 pt-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-[#342511] tracking-tight">{title}</h2>
        <Link
          to={seeAllPath}
          className="text-xs text-[#7C5F42] hover:text-[#342511] font-medium flex items-center gap-1 transition-colors"
        >
          <span>See all</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((short) => (
          <div
            key={short.id}
            onClick={() => navigate(seeAllPath)}
            className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-[#EDE8E4] cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[9/13] w-full overflow-hidden bg-neutral-200">
              <img
                src={short.image}
                alt={short.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Play badge */}
              <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                <Play size={12} className="fill-white translate-x-0.5" />
              </div>

              {/* Tag */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-md text-[10px] font-semibold text-[#342511]">
                {short.tag}
              </div>

              {/* Views */}
              <div className="absolute bottom-2 left-2.5 text-[11px] font-medium text-white/90">
                {short.views}
              </div>
            </div>

            {/* Title */}
            <div className="p-2.5">
              <h4 className="text-xs font-medium text-[#342511] line-clamp-2 leading-snug group-hover:text-[#8B6F54] transition-colors">
                {short.title}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
