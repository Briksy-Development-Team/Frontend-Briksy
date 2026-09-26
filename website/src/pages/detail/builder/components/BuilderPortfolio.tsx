import StaffGrid from '../../../../components/grids/StaffGrid';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Mousewheel } from "swiper/modules";
import PropertyGridCard from '../../../../components/cards/property/PropertyGridCard';
import { Link } from 'react-router-dom';
import type { PublicBuilderProject } from '../../../../api/seeker/organization.api';
import { SafeImage } from '../../../../components/custom/SafeImage';
import ProjectPlaceholder from '../../../../assets/place holder/builderbg.svg';

export function BuilderSnapshot({ snapshot }: { snapshot: any }) {
  const formatMoney = (val: number) => `$${val / 1000}k`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-[1.25rem] font-medium text-primary-brown">Build performance snapshot</h2>
        <p className="text-[0.875rem] text-primary-light-brown">
          In the last 12 months Harkaway Homes completed 62 homes and started 18 new builds across south-west Sydney.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-[0.875rem] font-medium text-primary-brown mb-3">New home builds</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-medium text-primary-brown">{formatMoney(snapshot.medianBuildPrice)}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Median build price</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-medium text-primary-brown">{snapshot.medianBuildTime} weeks</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Median build time</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-medium text-primary-brown">{snapshot.homesCompleted}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Homes completed</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-medium text-primary-brown">{snapshot.underConstruction}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Under construction</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[0.875rem] font-medium text-primary-brown mb-3">House and land</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-medium text-primary-brown">{formatMoney(snapshot.medianPackagePrice)}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Median package price</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-medium text-primary-brown">{snapshot.packagesAvailable}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Packages available</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-medium text-primary-brown">{snapshot.displayHomesOpen}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Display homes open</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <div className="text-[1.25rem] md:text-[1.5rem] font-medium text-primary-brown">{snapshot.estates}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Estates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuilderHomes({ homes, description, propertiesHref }: { homes: any[]; description?: string; propertiesHref?: string }) {
  return (
    <div className="flex flex-col items-start justify-start gap-6 overflow-hidden">
      <div className="flex flex-col gap-2">
        <h2 className="text-[1.25rem] font-medium text-primary-brown">Our homes</h2>
        <p className="text-[0.875rem] text-primary-light-brown">
          {description || "Properties currently published by this organisation."}
        </p>
      </div>

      <Swiper
        modules={[Mousewheel]}
        spaceBetween={14}
        slidesPerView="auto"
        watchOverflow={false}
        grabCursor
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: true,
        }}
        slidesOffsetBefore={0}
        slidesOffsetAfter={0}
        className="!ml-0  [overscroll-behavior-x:contain] touch-pan-y"
      >
        {homes.slice(0, 3).map((item) => (
          <SwiperSlide
            key={item.id}
            className=" !w-[19.4375rem]"
          >
            <PropertyGridCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div>
        <Link to={propertiesHref || '/search?tab=properties'} className="inline-block bg-white border border-white-100 text-primary-brown py-2 px-5 rounded-lg font-medium text-[0.875rem] hover:bg-white-50 transition-colors mt-2">
          Show all Properties
        </Link>
      </div>
    </div>
  );
}

export function BuilderProjects({ projects, builderName }: { projects: PublicBuilderProject[]; builderName?: string }) {
  if (!projects.length) return null;

  return <section className="flex flex-col gap-6" aria-labelledby="builder-projects-title">
    <div className="flex flex-col gap-2">
      <h2 id="builder-projects-title" className="text-[1.25rem] font-medium text-primary-brown">Our projects</h2>
      <p className="text-[0.875rem] text-primary-light-brown">Developments and projects from this builder.</p>
    </div>
    <Swiper
      modules={[Mousewheel]}
      spaceBetween={14}
      slidesPerView="auto"
      watchOverflow={false}
      grabCursor
      mousewheel={{ forceToAxis: true, sensitivity: 1, releaseOnEdges: true }}
      className="!ml-0 [overscroll-behavior-x:contain] touch-pan-y"
    >
      {projects.slice(0, 3).map((project) => {
        const image = project.images?.find((item) => item.is_primary)?.url || project.images?.[0]?.url || ProjectPlaceholder;
        const location = [project.location, project.state, project.postcode].filter(Boolean).join(', ');

        return <SwiperSlide key={project.id} className="!w-[19.4375rem]">
          <Link to={`/builder-project/${project.id}`} className="flex h-[28rem] w-[19.6667rem] flex-col overflow-hidden rounded-3xl bg-white text-left text-primary-brown">
            <div className="relative h-[60%] shrink-0 overflow-hidden">
              <SafeImage src={image} alt={project.name} className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[0.75rem] font-medium capitalize">
                {project.status.replaceAll('_', ' ')}
              </span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col p-4">
              <h3 className="line-clamp-2 text-[0.875rem] leading-[1.3]">{project.name}</h3>
              {project.project_type && <p className="mt-1 text-xs text-primary-light-brown">{project.project_type}</p>}
              {location && <p className="mt-2 line-clamp-2 text-[0.875rem]">{location}</p>}
              {project.description && <p className="mt-1 line-clamp-2 text-xs text-primary-light-brown">{project.description}</p>}
              <div className="mt-auto">
                <div className="w-full border-t border-primary-light-brown/70" />
                <div className="mt-3 flex items-center gap-2 text-[0.875rem]">
                  <span className="h-7 w-7 shrink-0 rounded-full bg-primary-brown" />
                  <span className="truncate">{builderName || 'Builder project'}</span>
                </div>
              </div>
            </div>
          </Link>
        </SwiperSlide>;
      })}
    </Swiper>
    <div>
      <Link to="#projects" className="mt-2 inline-block rounded-lg border border-white-100 bg-white px-5 py-2 text-[0.875rem] font-medium text-primary-brown transition-colors hover:bg-white-50">
        Show all Projects
      </Link>
    </div>
  </section>;
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
        <h2 className="text-[1.25rem] font-medium text-primary-brown">Build performance by home type</h2>
        <p className="text-[0.875rem] text-primary-light-brown">
          Based on 62 homes completed by Harkaway Homes in the last 12 months.
        </p>
      </div>

      <div className="flex flex-col w-full border-t border-gray-50">
        {rows.map((row, i) => (
          <div key={row.label} className={`flex flex-col md:flex-row items-start md:items-center py-5 ${i !== rows.length - 1 ? 'border-b border-gray-50' : ''}`}>
            <div className="flex-1 min-w-[200px] mb-4 md:mb-0">
              <div className="text-[0.875rem] font-medium text-primary-brown">{row.label}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">{row.data.built} built</div>
            </div>

            <div className="flex-1 min-w-[200px] mb-4 md:mb-0">
              <div className="text-[0.875rem] font-medium text-primary-brown">{formatMoney(row.data.medianPrice)}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">Median price</div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <div className="text-[0.875rem] font-medium text-primary-brown">{row.data.medianTime} weeks</div>
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
        <h2 className="text-[1.25rem] font-medium text-primary-brown">The team</h2>
        <p className="text-[0.875rem] text-primary-light-brown">
          Showing {team.length} team members at Harkaway Homes.
        </p>
      </div>
      <StaffGrid item={team} />
    </div>
  );
}
