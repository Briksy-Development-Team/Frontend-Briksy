import PropertyGridCard from '../cards/property/PropertyGridCard';

export default function PropertyGrid({ properties }: { properties: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyGridCard key={property.id} item={property} />
      ))}
    </div>
  );
}
