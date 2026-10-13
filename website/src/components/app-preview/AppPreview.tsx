import Apppreview from "../../assets/utils/apppreview.svg";
import Appbg from "../../assets/utils/appbg.png";
import Play from "../../assets/icons/Playstore.svg";
import Apple from "../../assets/icons/apple.svg";

const APP_STORE_URL = "#";
const GOOGLE_PLAY_URL = "#";

const StoreButtons = () => (
    <div className="flex gap-3">
        <a
            href={APP_STORE_URL}
            className="flex items-center gap-2 bg-white border border-black rounded-md py-2 px-3"
        >
            <img src={Apple} alt="" className="w-5 h-5 text-black shrink-0" />
            <span className="flex flex-col leading-none text-black">
                <span className="text-[0.5rem] xl:text-[0.5625rem]">Download on the</span>
                <span className="text-[1rem] xl:text-[1.125rem] text-nowrap font-medium">App Store</span>
            </span>
        </a>

        <a
            href={GOOGLE_PLAY_URL}
            className="flex items-center gap-2 bg-white border border-black rounded-md py-2 px-3"
        >
            <img src={Play} alt="" className="w-5 h-5 text-black shrink-0" />
            <span className="flex flex-col leading-none text-black">
                <span className="text-[0.5rem] xl:text-[0.5625rem] uppercase">Get it on</span>
                <span className="text-[1rem] xl:text-[1.125rem] text-nowrap font-medium">Google Play</span>
            </span>
        </a>
    </div>
);

const AppPreview = () => {
    return (
        <>
            <div
                className="sm:hidden relative w-full flex flex-col items-center gap-4 h-[80vh] py-10 bg-cover bg-center overflow-hidden"
                style={{ backgroundImage: `url(${Appbg})` }}
            >
                <img
                    src={Apppreview}
                    alt="Briksy app preview"
                    className="absolute right-0 top-10 h-[55%] w-auto"
                />

                <h2 className="mt-auto text-[1.875rem] font-medium text-white text-center tracking-tight leading-tight">
                    Download Briksy Today
                </h2>

                <p className="text-[1rem] text-white/80 text-center max-w-sm sm:max-w-md leading-relaxed">
                    Find trusted builders, discover verified properties, and manage
                    your real estate journey all in one place.
                </p>

                <StoreButtons />
            </div>

            {/* md and up: bordered card, phone image bleeding the outer border */}
            <div className="hidden sm:flex w-full px-[3%] justify-center items-center">
                <div className="relative w-full h-[300px] lg:h-[20rem] xl:h-[30rem] rounded-3xl border border-[#e2cbb3] overflow-hidden">
                    {/* Brown card sits behind the phone image, inset from the outer border */}
                    <div
                        className="absolute inset-y-[10%] left-[5%] lg:left-[10%] right-[15%] rounded-3xl bg-cover bg-center flex flex-col justify-center gap-6 md:gap-8 px-6 md:px-10 lg:px-14 py-6 z-0"
                        style={{ backgroundImage: `url(${Appbg})` }}
                    >
                        <div className="flex flex-col gap-2 text-[#f8f4ee]">
                            <h2 className="text-2xl xl:text-[3.625rem] leading-tight">
                                Download Briksy Today
                            </h2>
                            <p className="text-xs xl:text-[1rem] opacity-80 max-w-xs lg:max-w-md">
                                Find trusted builders, discover verified properties, and manage
                                your real estate journey all in one place.
                            </p>
                        </div>

                        <StoreButtons />
                    </div>

                    {/* Phone image bleeds full height of the outer border, overlapping the card */}
                    <img
                        src={Apppreview}
                        alt="Briksy app preview"
                        className="absolute top-0 right-0 h-full w-[45%] md:w-[38%] object-cover z-10"
                    />
                </div>
            </div>
        </>
    );
};

export default AppPreview;