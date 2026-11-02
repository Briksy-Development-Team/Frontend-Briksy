import Tool from "../../../assets/comunity/tool.svg";
import Bag from "../../../assets/comunity/bag.svg";
import Comer from "../../../assets/comunity/comer.svg";
import Shieldtick from "../../../assets/comunity/shieldtick.svg";
import Home from "../../../assets/comunity/home.svg";

import Toolbg from "../../../assets/comunity/toolbg.svg";
import Bagbg from "../../../assets/comunity/bagbg.svg";
import Comerbg from "../../../assets/comunity/comerbg.svg";
import Shieldtickbg from "../../../assets/comunity/shieldtickbg.svg";
import Homebg from "../../../assets/comunity/homebg.svg";

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

// md: old top/bottom position, lg and up: vertically centered
// (no transform, so GSAP's y animation still works)
const CENTER = "lg:top-0 lg:bottom-0 lg:my-auto lg:h-fit";

const RIGHT = `md:right-[1rem] md:top-[9%] lg:right-[4rem] xl:right-[6.75rem] 2xl:right-[6rem] ${CENTER}`;
const LEFT = `md:left-[1rem] md:bottom-[2rem] lg:left-[4rem] xl:left-[6.75rem] 2xl:left-[6rem] ${CENTER}`;

export const CARDS: CardData[] = [
  {
    position: RIGHT,
    icon: Tool,
    img: Toolbg,
    title: "Make Your Next Property Move",
    desc: "Showcase your services, experience, and past work while connecting with people actively looking for trusted property professionals.",
  },
  {
    position: LEFT,
    icon: Bag,
    img: Bagbg,
    title: "Find the Right Builder",
    desc: "Connect with property buyers and sellers who need trusted financial guidance throughout their property journey.",
  },
  {
    position: RIGHT,
    icon: Home,
    img: Homebg,
    title: "Find the Help you Need",
    desc: "Find verified properties and professionals, compare your options, and connect with the right people for your next property move.",
  },
  {
    position: LEFT,
    icon: Comer,
    img: Comerbg,
    title: "Everything property, Connected.",
    desc: "Get support throughout your property journey with guidance from the BRIKSY team, from finding the right professional to navigating your next step.",
  },
  {
    position: RIGHT,
    icon: Shieldtick,
    img: Shieldtickbg,
    title: "For BRIKSY Teams",
    desc: "Get support throughout your property journey with guidance from the BRIKSY team, from finding the right professional to navigating your next step.",
  },
];
