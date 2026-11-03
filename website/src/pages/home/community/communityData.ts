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


const CENTER = "lg:top-0 lg:bottom-0 lg:my-auto lg:h-fit";

const RIGHT = `md:right-[1rem] md:top-[9%] lg:right-[4rem] xl:right-[6.75rem] 2xl:right-[6rem] ${CENTER}`;
const LEFT = `md:left-[1rem] md:bottom-[2rem] lg:left-[4rem] xl:left-[6.75rem] 2xl:left-[6rem] ${CENTER}`;

export const CARDS: CardData[] = [
  {
    position: RIGHT,
    icon: Home,
    img: Homebg,
    title: "Make Your Next Property Move.",
    desc: "Discover properties, explore your options and connect with agents and property professionals who can help you move forward.",
  },
  {
    position: LEFT,
    icon: Bag,
    img: Bagbg,
    title: "Find the Right Builder.",
    desc: "Discover builders, explore their projects and experience, and find the right fit for your next build.",
  },
  {
    position: RIGHT,
    icon: Tool,
    img: Toolbg,
    title: "Find the Help You Need.",
    desc: "Discover trades and property professionals, explore their services and find those servicing your area.",
  },
  {
    position: LEFT,
    icon: Comer,
    img: Comerbg,
    title: "Everything Property, Connected.",
    desc: "From finding property to finding the people who help you buy, build and move forward, Briksy brings the property journey together in one place.",
  },
  {
    position: RIGHT,
    icon: Shieldtick,
    img: Shieldtickbg,
    title: "Build Your Business with Briksy.",
    desc: "Grow your presence, showcase your expertise and connect with the right people. Briksy gives property professionals the platform to build, grow and succeed.",
  },
];
