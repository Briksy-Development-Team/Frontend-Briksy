import Breadcrumb from "../../components/nav/Breadcrumb";

const BlogsPage = () => <div className="min-h-screen bg-[#F8F4EE] pt-28 pb-20 font-helvetica"><div className="mx-auto px-[3%]"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blogs" }]} /><h1 className="mt-6 text-3xl font-medium text-primary-brown">Latest articles</h1><div className="mt-6 rounded-2xl bg-white p-8 text-primary-light-brown">No articles are currently available from the backend.</div></div></div>;

export default BlogsPage;
