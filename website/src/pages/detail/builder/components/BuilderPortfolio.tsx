import PropertyGrid from '../../../../components/grids/PropertyGrid';
import StaffGrid from '../../../../components/grids/StaffGrid';

export function BuilderSnapshot({ snapshot }: { snapshot: any }) {
  const formatMoney = (val: number) => `$${val / 1000}k`;
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[1.25rem] font-bold text-primary-brown">Build performance snapshot</h2>
        <p className="text-[0.875rem] text-primary-light-brown">
          In the last 12 months Harkaway Homes completed 62 homes and started 18 new builds across south-west Sydney.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-[0.875rem] font-semibold text-primary-brown mb-3">New home builds</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-bold text-primary-brown">{formatMoney(snapshot.medianBuildPrice)}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Median build price</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-bold text-primary-brown">{snapshot.medianBuildTime} weeks</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Median build time</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-bold text-primary-brown">{snapshot.homesCompleted}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Homes completed</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-bold text-primary-brown">{snapshot.underConstruction}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Under construction</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[0.875rem] font-semibold text-primary-brown mb-3">House and land</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-bold text-primary-brown">{formatMoney(snapshot.medianPackagePrice)}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Median package price</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-bold text-primary-brown">{snapshot.packagesAvailable}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Packages available</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-bold text-primary-brown">{snapshot.displayHomesOpen}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Display homes open</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-bold text-primary-brown">{snapshot.estates}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Estates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuilderHomes({ homes }: { homes: any[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[1.25rem] font-bold text-primary-brown">Our homes</h2>
        <p className="text-[0.875rem] text-primary-light-brown">
          Harkaway Homes has completed 412 homes of all time. Currently 9 house and land packages, 12 display homes and 18 builds under construction.
        </p>
      </div>
      <PropertyGrid properties={homes} />
      <div>
        <button className="bg-white border border-white-100 text-primary-brown py-2 px-5 rounded-lg font-medium text-[0.875rem] hover:bg-white-50 transition-colors mt-2">
          Show all Properties
        </button>
      </div>
    </div>
  );
}

export function BuilderPerformance({ performance }: { performance: any }) {
  const formatMoney = (val: number) => `$${val / 1000}k`;
  const rows = [
    { label: 'Single storey', data: performance.singleStorey },
    { label: 'Double storey', data: performance.doubleStorey },
    { label: 'Knockdown rebuild', data: performance.knockdown },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[1.25rem] font-bold text-primary-brown">Build performance by home type</h2>
        <p className="text-[0.875rem] text-primary-light-brown">
          Based on 62 homes completed by Harkaway Homes in the last 12 months.
        </p>
      </div>

      <div className="flex flex-col w-full border-t border-gray-50">
        {rows.map((row, i) => (
          <div key={row.label} className={`flex flex-col md:flex-row items-start md:items-center py-5 ${i !== rows.length - 1 ? 'border-b border-gray-50' : ''}`}>
            <div className="flex-1 min-w-[200px] mb-4 md:mb-0">
              <div className="text-[0.875rem] font-semibold text-primary-brown">{row.label}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">{row.data.built} built</div>
            </div>
            
            <div className="flex-1 min-w-[200px] mb-4 md:mb-0">
              <div className="text-[0.875rem] font-semibold text-primary-brown">{formatMoney(row.data.medianPrice)}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Median price</div>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <div className="text-[0.875rem] font-semibold text-primary-brown">{row.data.medianTime} weeks</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Median build time</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BuilderTeam({ team }: { team: any[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[1.25rem] font-bold text-primary-brown">The team</h2>
        <p className="text-[0.875rem] text-primary-light-brown">
          Showing {team.length} team members at Harkaway Homes.
        </p>
      </div>
      <StaffGrid staff={team} />
    </div>
  );
}
