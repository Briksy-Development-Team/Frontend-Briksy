import { Link } from "react-router-dom";
import ComingI from "../../assets/default/coming.svg";

const Coming = () => {
    return (
        <section className="min-h-screen font-helvetica bg-[#FCFAF7] flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-4xl text-center">
                
                <img loading="lazy"
                    src={ComingI}
                    alt="Coming Soon"
                    className="mx-auto w-full max-w-[260px] sm:max-w-[340px] "
                />

               

                
                <h1 className="mt-6 text-[1.875rem] font-medium tracking-tight text-[#2D221A] sm:text-4xl lg:text-5xl">
                    Building Something Bigger
                </h1>

                
                <p className="mx-auto mt-5 max-w-2xl text-[0.875rem] leading-tight text-[#6B645E] sm:text-lg">
                    We're expanding Briksy with verified professionals, smarter property
                    tools, improved search, and a better overall experience. The next
                    version is currently under development and will be available soon.
                </p>

                <p className="mt-5 text-2xl font-semibold tracking-wide text-[#4E3524]">
                    Coming Soon...
                </p>

                <div className="mt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-lg border border-[#8B7355] px-6 py-3 text-sm font-medium text-[#4E3524] transition-all duration-300 hover:bg-[#4E3524] hover:text-white"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Coming;