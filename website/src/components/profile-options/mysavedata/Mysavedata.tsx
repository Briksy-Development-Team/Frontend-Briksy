import Placeholderproperty from "../../../assets/profile/placeholderproperty.svg";

interface SavedSectionProps {
  title: string;
}

const SavedSection = ({ title }: SavedSectionProps) => (
    <div className="space-y-2 ">
        <div>
            <p className="text-[1.25rem] font-medium text-primary-brown">
                {title}
            </p>
        </div>
        <div className="bg-white w-full flex flex-col items-center py-[4.5rem] px-[2.5rem] space-y-[1rem] rounded-[1rem]">
            <img src={Placeholderproperty} alt="" />
            <p>No saved searches yet</p>
            <p className="w-[40%] mx-auto text-center">
                Run a search, then hit Save. We'll email you when a new verified
                professional or listing matches what you're after.
            </p>
            <span className="space-x-[0.75rem]">
                <button className="rounded-[62.4375rem] bg-primary-brown px-[1.6rem] py-[0.875rem] text-[0.875rem] text-white font-medium">
                    Find a professional
                </button>
                <button className="rounded-[62.4375rem] border border-gray-400 px-[1.6rem] py-[0.875rem] text-[0.875rem] text-primary-brown font-medium">
                    Browse properties
                </button>
            </span>
        </div>
    </div>
);

const Mysavedata = () => {
    return (
        <div className="w-full space-y-[2.5rem]">

            <div className="space-y-1">
                <h1 className="text-[1.875rem] font-medium text-primary-brown">
                    Saved searches
                </h1>

                <p className="text-[0.75rem] text-primary-light-brown">
                    We'll tell you when something new matches.
                </p>
            </div>

            <div className="space-y-[2.5rem]">
                <SavedSection title="Properties" />
                <SavedSection title="Professionals" />
                <SavedSection title="Builders/Org." />
            </div>

        </div>
    );
};

export default Mysavedata;