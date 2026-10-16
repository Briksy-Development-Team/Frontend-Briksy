import AppHeader from "../../components/AppHeader";
import AppSearchBar from "../../components/AppSearchBar";
import AppQuickActions from "../../components/AppQuickActions";
import TrendingProperty from "../../../pages/v2/trendingproperty/TrendingProperty";
import BuilderList from "../../../pages/v2/builderlist/BuilderList";
import ServiceList from "../../../pages/v2/servicelist/ServiceList";
import Blogs from "../../../pages/home/blogs/Blogs";

export default function AppHome() {
  return (
    <div className="min-h-screen bg-[#F8F4EE] pb-6">
      {/* Mobile App Header */}
      <AppHeader />

      {/* Mobile App Search Bar */}
      <AppSearchBar />

      {/* Quick Category Icons */}
      <AppQuickActions />

      {/* Main Content Sections */}
      <div className="space-y-6 pt-2">
        <TrendingProperty />
        <BuilderList />
        <ServiceList />
        <Blogs />
      </div>
    </div>
  );
}
