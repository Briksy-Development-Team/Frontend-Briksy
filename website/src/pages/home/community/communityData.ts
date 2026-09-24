import Stars from "../../../assets/icons/search/star.svg";
import Leaf from "../../../assets/icons/search/leaf.svg";
import Property from "../../../assets/icons/search/property.svg";
import Traders from "../../../assets/icons/search/trades.svg";

export const FRAME_COUNT = 174;
export const SCROLL_PER_CARD = 600;

export const getFrame = (i: number) =>
  `/frames-webp/frame_${String(i).padStart(4, "0")}.webp`;

export type CardData = {
  position: string;
  icon: string;
  img: string;
  title: string;
  desc: string;
};

export const CARDS: CardData[] = [
  {
    position:
      "md:right-[1rem] md:top-[9%] lg:right-[4rem] lg:top-[10%] xl:right-[6.75rem] xl:top-[12%] 2xl:right-[8rem] 2xl:top-[14%]",
    icon: Property,
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=240&fit=crop",
    title: "For Professionals & Trades",
    desc: "Showcase your services, experience, and past work while connecting with people actively looking for trusted property professionals.",
  },

  {
    position:
      "md:left-[1rem] md:bottom-[2rem] lg:left-[4rem] lg:bottom-[2.5rem] xl:left-[6.75rem] xl:bottom-[2rem] 2xl:left-[8rem] 2xl:bottom-[3rem]",
    icon: Stars,
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=240&fit=crop",
    title: "For Mortgage Brokers",
    desc: "Connect with property buyers and sellers who need trusted financial guidance throughout their property journey.",
  },

  {
    position:
      "md:right-[1rem] md:top-[9%] lg:right-[4rem] lg:top-[10%] xl:right-[6.75rem] xl:top-[12%] 2xl:right-[8rem] 2xl:top-[14%]",
    icon: Leaf,
    img: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=240&fit=crop",
    title: "For Buyers & Sellers",
    desc: "Find verified properties and professionals, compare your options, and connect with the right people for your next property move.",
  },

  {
    position:
      "md:left-[1rem] md:bottom-[2rem] lg:left-[4rem] lg:bottom-[2.5rem] xl:left-[6.75rem] xl:bottom-[2rem] 2xl:left-[8rem] 2xl:bottom-[3rem]",
    icon: Traders,
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=240&fit=crop",
    title: "For BRIKSY Teams",
    desc: "Get support throughout your property journey with guidance from the BRIKSY team, from finding the right professional to navigating your next step.",
  },
];
