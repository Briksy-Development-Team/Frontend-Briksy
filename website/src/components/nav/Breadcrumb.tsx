import { Link, useNavigate } from 'react-router-dom';

export type BreadcrumbItem = {
  label: string;
  href?: string;
  isBack?: boolean;
  onClick?: () => void;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const navigate = useNavigate();

  return (
    <div className="text-[0.875rem] text-primary-light-brown mb-6 flex items-center gap-2 font-medium flex-wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            {item.onClick && !isLast ? (
              <button 
                onClick={item.onClick}
                className="hover:text-primary-brown transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ) : item.isBack && !isLast ? (
              <button 
                onClick={() => navigate(-1)} 
                className="hover:text-primary-brown transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ) : item.href && !isLast ? (
              <Link to={item.href} className="hover:text-primary-brown transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-primary-brown" : ""}>
                {item.label}
              </span>
            )}
            
            {!isLast && (
              <span className="text-[1.1rem] leading-none mb-[2px] font-light">
                &#8250;
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
