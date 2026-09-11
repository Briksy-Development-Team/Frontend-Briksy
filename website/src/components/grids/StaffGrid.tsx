import TraderGridCard from '../cards/trader/TraderGridCard';

export default function StaffGrid({ item }: { item: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {item.map((member) => (
        <TraderGridCard 
          key={member.id} 
          item={{
            ...member,
            tagLine: member.role,
            bannerImage: member.banner,
            reviews: member.reviewsCount || member.reviews || 0,
          }} 
        />
      ))}
    </div>
  );
}
