import BuilderListCard from "../../../../components/cards/builder/BuilderListCard";

export const PropertyCompanyDetails = ({ company }: { company: any }) => {
  if (!company || !company.name) return null;

  const builderItem = {
    id: company.id,
    name: company.name,
    avatar: company.logo,
    location: company.location,
    tags: company.tags || [],
    rating: company.rating,
    reviews: company.reviews,
    establishedYear: company.since,
    isFavourite: false,
  };

  return (
    <div className="flex flex-col gap-3.5 w-full">
      <h2 className="text-[20px] font-medium leading-[28px] tracking-[-0.005em] text-[#222222]">
        Company Details
      </h2>
      <div className="w-full">
        {builderItem.id ? (
          <BuilderListCard item={builderItem as any} />
        ) : (
          <div className="rounded-[1.25rem] border border-[#E7E7E4] bg-white p-4 text-[#342511]">
            <h3 className="text-[16px] font-medium">{company.name}</h3>
            {company.location && (
              <p className="text-[14px] text-[#6B6560] mt-1">{company.location}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
