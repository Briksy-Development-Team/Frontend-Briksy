import { useEffect, useRef, useState } from "react";
import type { SortType, ViewType } from "../../types/search";
import GridIcon from "../../assets/filter/grid.svg?react";
import ListIcon from "../../assets/filter/list.svg?react";
import MapIcon from "../../assets/filter/map.svg?react";

type Props = {
    view: ViewType;
    sort: SortType;
    total: number;
    setView: React.Dispatch<React.SetStateAction<ViewType>>;
    setSort: React.Dispatch<React.SetStateAction<SortType>>;
};

const sortOptions = [
    { label: "Featured", value: "featured" },
    { label: "Date (Newest - Oldest)", value: "newest" },
    { label: "Date (Oldest - Newest)", value: "oldest" },
    { label: "Price (Lowest - Highest)", value: "price-low" },
    { label: "Price (Highest - Lowest)", value: "price-high" },
];

const Toolbar = ({ view, sort, total, setView, setSort }: Props) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);

        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <>
            <h2 className="mb-6 text-lg font-medium md:text-xl">
                Explore {total} experiences
            </h2>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setView("list")}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-2 transition sm:px-8 ${view === "list"
                                ? "bg-primary-brown text-white"
                                : "border-[#DBDAD3] bg-white text-primary-brown"
                            }`}
                    >
                        <ListIcon className="h-5 w-5" />
                        <span>List</span>
                    </button>

                    <button
                        onClick={() => setView("map")}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-2 transition sm:px-8 ${view === "map"
                                ? "bg-primary-brown text-white"
                                : "border-[#DBDAD3] bg-white text-primary-brown"
                            }`}
                    >
                        <MapIcon className="h-5 w-5" />
                        <span>Map</span>
                    </button>

                    <button
                        onClick={() => setView("grid")}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-2 transition sm:px-8 ${view === "grid"
                                ? "bg-primary-brown text-white"
                                : "border-[#DBDAD3] bg-white text-primary-brown"
                            }`}
                    >
                        <GridIcon className="h-5 w-5" />
                        <span>Grid</span>
                    </button>
                </div>

                
                <div
                    className="relative w-full lg:w-auto"
                    ref={dropdownRef}
                >
                    <div className="flex items-center justify-between gap-4 lg:justify-end">
                        <span className="text-base">Sort By :</span>

                        <button
                            onClick={() => setOpen((prev) => !prev)}
                            className="min-w-[170px] rounded-xl border border-[#DBDAD3] bg-white px-6 py-2 text-left text-base"
                        >
                            {sortOptions.find((item) => item.value === sort)?.label}
                        </button>
                    </div>

                    {open && (
                        <div className="absolute right-0 top-full z-50 mt-4 w-full rounded-2xl bg-white p-4 shadow-xl lg:w-[20rem]">
                            <p className="mx-auto w-[90%] text-sm font-semibold">
                                Featured
                            </p>

                            {sortOptions.slice(1).map((item, index) => (
                                <button
                                    key={item.value}
                                    onClick={() => {
                                        setSort(item.value as SortType);
                                        setOpen(false);
                                    }}
                                    className={`mx-auto block w-[90%] py-4 text-left text-base transition ${sort === item.value ? "font-medium" : "font-normal"
                                        } ${index !== sortOptions.slice(1).length - 1
                                            ? "border-b border-[#E5E0D7]"
                                            : ""
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Toolbar;
