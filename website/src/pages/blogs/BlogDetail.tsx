import { Link } from "react-router-dom";

const BlogDetail = () => <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F4EE] px-6 text-center"><h1 className="text-3xl font-medium mb-4">Article not available</h1><p className="text-primary-light-brown mb-6">Articles will appear here when published through the backend.</p><Link to="/blogs" className="text-primary-brown underline">Back to all articles</Link></div>;

export default BlogDetail;
