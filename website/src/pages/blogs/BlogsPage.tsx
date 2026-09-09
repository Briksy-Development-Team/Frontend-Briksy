import { Link } from "react-router-dom";
import { mockBlogs } from "../../data/mockBlogs";
import type { BlogPost } from "../../data/mockBlogs";
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
    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>
      {category}
    </span>
  );
};

const BlogCard = ({ blog }: { blog: BlogPost }) => {
  return (
    <Link to={`/blogs/${blog.id}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="h-64 overflow-hidden">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="mb-4">
            <CategoryTag category={blog.category}  />
          </div>
          <h3 className="text-[1rem] font-medium text-primary-brown mb-4 line-clamp-2">
            {blog.title}
          </h3>
          <div className="mt-auto">
            <p className="text-[0.875rem] text-primary-light-brown  ">{blog.date}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const BlogsPage = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blogs" }
  ];

  return (
    <div className="min-h-screen bg-[#F8F4EE] pt-28 pb-20 font-helvetica">
      <div className="mx-auto px-[5%] max-w-7xl">
        <Breadcrumb items={breadcrumbs} />
        
        <div className="flex justify-between items-center mb-10 mt-6">
          <h1 className="text-3xl font-medium text-primary-brown">Latest articles</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors">
            View all <span>&rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
