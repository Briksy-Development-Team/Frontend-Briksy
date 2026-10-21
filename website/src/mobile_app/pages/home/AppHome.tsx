import AppHomeHero from "../../components/home/AppHomeHero";
import AppVerifiedPromo from "../../components/home/AppVerifiedPromo";
import AppPopularNearYou from "../../components/home/AppPopularNearYou";
import AppShorts from "../../components/home/AppShorts";

export default function AppHome() {
  return (
    <div className="min-h-screen  pb-24 font-helvetica select-none">
      <AppHomeHero />

      <div className="relative z-20 -mt-7 bg-[#f0eae5] rounded-t-[28px] px-4 pt-3 space-y-6 max-w-lg mx-auto shadow-[-2px_0_12px_rgba(0,0,0,0.06)]">
        <div className="mx-auto w-18 h-1 rounded-full bg-primary-brown" />

        <AppVerifiedPromo />
        <AppPopularNearYou />
        <AppShorts />
      </div>
    </div>
  );
}