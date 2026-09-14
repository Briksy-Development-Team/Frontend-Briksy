import BuilderListCard from "../../../../components/cards/builder/BuilderListCard";

export const PropertyCompanyDetails = ({ company }: { company: any }) => {
  const builderItem = {
    id: company.id,
    name: company.name,
    avatar: company.logo,
    location: company.location,
    tags: company.tags,
    rating: company.rating,
    reviews: company.reviews,
    establishedYear: company.since,
    isFavourite: false
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[1.25rem] font-medium text-primary-brown">Company Details</h2>
      <div className="max-w-[600px]">
        {builderItem.id ? (
          <BuilderListCard item={builderItem as any} />
        ) : (
          <div className="rounded-[1.25rem] border border-[#E7E7E4] bg-white px-4 py-4 text-primary-brown">
            {company.name}
          </div>
        )}
      </div>
    </div>
  );
};

