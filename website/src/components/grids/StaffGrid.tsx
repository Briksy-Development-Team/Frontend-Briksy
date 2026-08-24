import StaffCard from '../cards/staff/StaffCard';

export default function StaffGrid({ staff }: { staff: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {staff.map((member) => (
        <StaffCard key={member.id} member={member} />
      ))}
    </div>
  );
}
