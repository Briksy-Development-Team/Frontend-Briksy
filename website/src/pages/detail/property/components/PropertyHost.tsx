import BuilderListCard from "../../../../components/cards/builder/BuilderListCard";

export const PropertyCompanyDetails = ({ company }: { company: any }) => {
  const builderItem = {
    id: company.id || 1,
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
      <h2 className="text-[1.25rem] font-bold text-primary-brown">Company Details</h2>
      <div className="max-w-[600px]">
        <BuilderListCard item={builderItem as any} />
      </div>
    </div>
  );
};


