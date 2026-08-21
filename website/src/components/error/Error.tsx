import { Link } from "react-router-dom";
import ErrorI from "../../assets/default/error.svg";

const Error = () => {
    return (
        <section className="h-screen flex items-center font-helvetica justify-center ">
            <div className="w-full max-w-6xl bg-white-50 rounded-md flex flex-col items-center justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-20 lg:py-24">
                
                <img loading="lazy"
                    src={ErrorI}
                    alt="404 Error"
                    className="w-full  max-w-[260px] sm:max-w-[340px]-contain"
                />

                <h1 className="mt-8 text-center text-[1.875rem] sm:text-3xl lg:text-4xl font-medium text-[#2F241E]">
                    Oops! We couldn't find that page.
                </h1>

                <p className="mt-3 max-w-xl text-center text-0.675rem sm:text-[0.875rem] text-[#7A7068] leading-relaxed">
                    It may have been relocated or is no longer available.
                    <br className="hidden sm:block" />
                    Let&apos;s help you get back on track.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/"
                        className="rounded-md border border-[#8B7355] px-4 py-3 text-center text-sm font-medium text-[#4E3524] transition-all duration-200 hover:bg-[#4E3524] hover:text-white"
                    >
                        Return Home
                    </Link>

                    <Link
                        to="/contact"
                        className=" rounded-md border border-[#8B7355] px-4 py-3 text-center text-sm font-medium text-[#4E3524] transition-all duration-200 hover:bg-[#4E3524] hover:text-white"
                    >
                        Ask AI For Help
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Error;