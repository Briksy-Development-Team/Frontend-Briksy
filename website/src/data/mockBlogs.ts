export type BlogPost = {
  id: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  content: string;
};

export const mockBlogs: BlogPost[] = [
  {
    id: "1",
    title: "Mastering the art of pitching your business",
    date: "May 23, 2024",
    category: "Entrepreneurship",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
    content: `
      <h2>The Importance of a Great Pitch</h2>
      <p>Pitching your business effectively is one of the most crucial skills any entrepreneur can develop. A strong pitch can secure funding, attract top talent, and win over key clients.</p>
      <p>Here are some key strategies to master your pitch:</p>
      <ul>
        <li><strong>Know your audience:</strong> Tailor your message to what matters most to the people you are pitching to.</li>
        <li><strong>Tell a compelling story:</strong> People connect with stories, not just numbers. Share the journey of why you started.</li>
        <li><strong>Keep it concise:</strong> Get straight to the point. Respect their time and leave them wanting more.</li>
      </ul>
      <p>Remember, practice makes perfect. Rehearse your pitch until it sounds natural and conversational.</p>
    `,
  },
  {
    id: "2",
    title: "The power of networking for entrepreneurs",
    date: "May 18, 2024",
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop",
    content: `
      <h2>Why Networking Matters</h2>
      <p>In the world of technology and entrepreneurship, who you know can often be as important as what you know. Building a strong professional network opens doors to new opportunities, collaborations, and valuable mentorship.</p>
      <p>Successful networking isn't just about collecting business cards; it's about building genuine, mutually beneficial relationships.</p>
      <h3>Tips for Effective Networking</h3>
      <ul>
        <li>Attend industry conferences and local meetups.</li>
        <li>Be active on professional platforms like LinkedIn.</li>
        <li>Always offer value before asking for a favor.</li>
      </ul>
    `,
  },
  {
    id: "3",
    title: "Turning your passion into a full-time career",
    date: "Apr 25, 2024",
    category: "Creator",
    imageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop",
    content: `
      <h2>Making the Leap</h2>
      <p>Many creators dream of quitting their day jobs to pursue their passion full-time. While it's an exciting prospect, it requires careful planning and dedication.</p>
      <p>Before making the leap, ensure you have a solid financial runway and a clear monetization strategy. Diversifying your income streams—such as through sponsorships, merchandise, and Patreon—can provide stability.</p>
      <p>Treat your passion like a business from day one. Set a schedule, track your expenses, and continuously analyze your growth metrics.</p>
    `,
  },
  {
    id: "4",
    title: "Creating content that resonates with your audience",
    date: "Apr 2, 2024",
    category: "Creator",
    imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1964&auto=format&fit=crop",
    content: `
      <h2>Understanding Your Audience</h2>
      <p>The key to successful content creation is deep empathy for your audience. What are their pain points? What entertains them? What questions are they asking?</p>
      <p>Use analytics tools to understand demographic data, but don't forget qualitative feedback. Read comments, conduct polls, and have actual conversations with your community.</p>
      <h3>Quality vs. Quantity</h3>
      <p>While consistency is important, never sacrifice quality for the sake of publishing more frequently. A single piece of highly resonant content can perform better than dozens of mediocre posts.</p>
    `,
  },
  {
    id: "5",
    title: "The latest tech trends every creator should know",
    date: "Feb 20, 2024",
    category: "Entrepreneurship",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop",
    content: `
      <h2>Staying Ahead of the Curve</h2>
      <p>Technology moves fast, and creators who adapt quickly often gain a significant advantage. From AI-assisted editing tools to new social platforms, staying informed is critical.</p>
      <p>Currently, generative AI is transforming how creators ideate and produce content. Tools like ChatGPT and Midjourney are becoming standard in many workflows.</p>
      <p>However, while tech can enhance your workflow, the core of your content should always remain authentic and uniquely yours.</p>
    `,
  },
  {
    id: "6",
    title: "Balancing creativity with business as a creator",
    date: "Mar 5, 2024",
    category: "Creator",
    imageUrl: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=2000&auto=format&fit=crop",
    content: `
      <h2>The Dual Identity</h2>
      <p>Creators often struggle to balance their artistic vision with the realities of running a business. It's a delicate dance between making what you love and making what pays the bills.</p>
      <p>One effective strategy is the 'One for me, one for them' approach, where you alternate between highly commercial projects and passion projects.</p>
      <p>Remember that burning out creatively is just as dangerous as running out of money. Protect your creative energy by setting boundaries and taking necessary breaks.</p>
    `,
  },
  {
    id: "7",
    title: "Navigating the complexities of startup funding",
    date: "Jan 12, 2024",
    category: "Entrepreneurship",
    imageUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop",
    content: `
      <h2>Understanding Your Options</h2>
      <p>Bootstrapping, angel investors, venture capital—the world of startup funding is vast and complex. Choosing the right path depends entirely on your business model and growth goals.</p>
      <p>Venture capital isn't for everyone. It requires hyper-growth and an eventual exit. If you want to build a sustainable, profitable lifestyle business, bootstrapping or securing a small business loan might be better choices.</p>
    `,
  },
  {
    id: "8",
    title: "Building a resilient company culture",
    date: "Dec 05, 2023",
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    content: `
      <h2>Culture is What You Do</h2>
      <p>Company culture isn't about ping-pong tables and free snacks. It's about how your team behaves when things go wrong, how decisions are made, and how employees treat one another.</p>
      <p>To build a resilient culture, focus on psychological safety, radical candor, and alignment on core values. Hire carefully and don't be afraid to let go of toxic high-performers.</p>
    `,
  },
  {
    id: "9",
    title: "Scaling your infrastructure for global reach",
    date: "Nov 18, 2023",
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    content: `
      <h2>Preparing for Hypergrowth</h2>
      <p>When your user base starts growing exponentially, your infrastructure needs to keep up. Moving from a monolithic architecture to microservices is often a necessary step for tech startups looking to scale globally.</p>
      <p>Invest early in DevOps and automated testing. The cost of a bad deployment increases dramatically as your user base grows.</p>
    `,
  },
  {
    id: "10",
    title: "The art of community building",
    date: "Oct 30, 2023",
    category: "Creator",
    imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop",
    content: `
      <h2>Beyond Just Followers</h2>
      <p>Having an audience is passive; having a community is active. A strong community will support you, advocate for you, and even help you moderate and grow.</p>
      <p>Foster community by creating spaces for your audience to interact with each other, not just with you. Discord servers, Facebook groups, and dedicated forums are great tools for this.</p>
    `,
  },
];
