import short1 from "../../assets/shorts/short_1.png";
import short2 from "../../assets/shorts/short_2.png";
import short3 from "../../assets/shorts/short_3.png";
import short4 from "../../assets/shorts/short_4.png";

export interface ShortComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
  isLiked?: boolean;
}

export interface ShortItem {
  id: string;
  title: string;
  description?: string;
  views: string;
  image: string;
  videoUrl?: string;
  uploader: {
    name: string;
    avatar: string;
    isVerified?: boolean;
    isFollowing?: boolean;
  };
  likesCount: string;
  isLiked?: boolean;
  commentsCount: number;
  comments?: ShortComment[];
}

export const DEFAULT_SHORTS: ShortItem[] = [
  {
    id: "1",
    title: "Mastering the transition between technical and decorative finishes",
    description: "In this breakdown, see how architectural flush skirting and hidden shadow lines create a seamless junction between microcement floors and rendered drywall. Essential for luxury modern renovations.",
    views: "2.1m views",
    image: short1 || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    uploader: {
      name: "Briksy Architecture",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      isVerified: true,
      isFollowing: false,
    },
    likesCount: "128K",
    isLiked: false,
    commentsCount: 42,
    comments: [
      {
        id: "c1",
        author: "Marcus Vance",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
        text: "The shadow line junction around the doorways looks incredible. What profile aluminum extrusion did you guys specify?",
        timeAgo: "2 hours ago",
        likes: 18,
      },
      {
        id: "c2",
        author: "Studio Riva",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
        text: "Clean execution! Microcement requires so much skill at the expansion joints.",
        timeAgo: "5 hours ago",
        likes: 9,
      },
      {
        id: "c3",
        author: "Liam K.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
        text: "Saved this for my upcoming build in South Yarra!",
        timeAgo: "1 day ago",
        likes: 4,
      },
    ],
  },
  {
    id: "2",
    title: "Inside Melbourne's latest sustainable luxury home build",
    description: "Take a 60-second tour of this carbon-neutral passive house featuring thermally broken double glazing, cross-laminated timber beams, and a 15kW integrated solar roof system.",
    views: "1.4m views",
    image: short2 || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    uploader: {
      name: "EcoBuild Melbourne",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
      isVerified: true,
      isFollowing: true,
    },
    likesCount: "94K",
    isLiked: false,
    commentsCount: 28,
    comments: [
      {
        id: "c4",
        author: "David Chen",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80",
        text: "What R-value was achieved on the exterior wall assembly?",
        timeAgo: "3 hours ago",
        likes: 12,
      },
      {
        id: "c5",
        author: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        text: "The timber warmth balances the modern aesthetic perfectly.",
        timeAgo: "6 hours ago",
        likes: 7,
      },
    ],
  },
  {
    id: "3",
    title: "How to inspect structural timber before signing renovation quotes",
    description: "Don't get caught with unforeseen repair costs! 3 red flags every property buyer and renovator should look for when inspecting roof trusses, floor bearers, and subfloor ventilation.",
    views: "890k views",
    image: short3 || "https://images.unsplash.com/photo-1541888946425-d0fbb18f156f?auto=format&fit=crop&w=800&q=80",
    uploader: {
      name: "Apex Master Builders",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      isVerified: false,
      isFollowing: false,
    },
    likesCount: "67K",
    isLiked: false,
    commentsCount: 19,
    comments: [
      {
        id: "c6",
        author: "Sophie Taylor",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
        text: "Crucial advice! We almost bought a place with undetected dry rot last month.",
        timeAgo: "1 hour ago",
        likes: 15,
      },
    ],
  },
  {
    id: "4",
    title: "Top 7 smart energy installations yielding 20%+ ROI",
    description: "From heat-pump hot water systems to phase-change insulation and dynamic smart blinds, discover the highest ROI energy upgrades you can make in Australian homes this year.",
    views: "640k views",
    image: short4 || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    uploader: {
      name: "GreenTech Innovations",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      isVerified: true,
      isFollowing: false,
    },
    likesCount: "48K",
    isLiked: false,
    commentsCount: 15,
    comments: [
      {
        id: "c7",
        author: "Tom H.",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80",
        text: "Heat pump hot water rebates made this a no-brainer for us. Great video!",
        timeAgo: "4 hours ago",
        likes: 8,
      },
    ],
  },
];
