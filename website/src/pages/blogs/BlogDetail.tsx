import { useParams, Link } from "react-router-dom";
import { mockBlogs } from "../../data/mockBlogs";
import Breadcrumb from "../../components/nav/Breadcrumb";

const CategoryTag = ({ category }: { category: string }) => {
  let bgColor = "bg-pink-100";
  let textColor = "text-pink-800";

  if (category === "Tech") {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
  } else if (category === "Creator") {
    bgColor = "bg-purple-100";
    textColor = "text-purple-800";
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {category}
    </span>
  );
};

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const blog = mockBlogs.find((b) => b.id === id);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F4EE]">
        <h1 className="text-3xl font-medium mb-4">Blog post not found</h1>
        <Link to="/blogs" className="text-primary-brown underline">
          Back to all blogs
        </Link>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blogs", href: "/blogs" },
    { label: blog.title }
  ];

  return (
    <div className="min-h-screen] pt-28 pb-20 font-helvetica">
      <div className="mx-auto px-[5%]">
        <Breadcrumb items={breadcrumbs} />
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-12 mt-6">
          <div className="flex flex-col gap-4 ">
            <p className="text-sm text-[#697586]">{blog.date}</p>
            <div className="flex items-center gap-2">
              <CategoryTag category={blog.category}  />
            </div>
            <h1 className="text-4xl lg:text-[3rem] font-medium text-primary-brown leading-tight">
              {blog.title}
            </h1>
          </div>
          <div className="w-full lg:w-[638px] h-[300px] shrink-0 rounded-2xl overflow-hidden shadow-sm">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="w-full h-px bg-[#EDE8E4] mb-12" />

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 max-w-[800px]">
            <div
              className="prose prose-lg prose-headings:font-medium prose-headings:text-primary-brown prose-p:text-[#4A5568] prose-a:text-primary-brown max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Sidebar CTA */}
          <div className="w-full lg:w-[308px] shrink-0 mt-8 lg:mt-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EDE8E4] sticky top-32">
              <h3 className="text-xl font-medium text-primary-brown mb-4">
                Stay Updated
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Get the latest insights and resources delivered straight to your inbox.
              </p>
              <button className="w-full py-3 bg-primary-brown text-white font-medium rounded-full hover:bg-[#463116] transition-colors">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
