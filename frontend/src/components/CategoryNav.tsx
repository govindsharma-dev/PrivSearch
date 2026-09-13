import { Link, useLocation } from 'react-router-dom';

interface CategoryNavProps {
  query: string;
}

const categories = [
  { label: 'Web',     path: '/search',  icon: 'public',        searxng: 'general' },
  { label: 'Images',  path: '/images',  icon: 'image',         searxng: 'images'  },
  { label: 'Videos',  path: '/videos',  icon: 'smart_display', searxng: 'videos'  },
  { label: 'News',    path: '/news',    icon: 'newspaper',     searxng: 'news'    },
  { label: 'Maps',    path: '/maps',    icon: 'map',           searxng: 'map'     },
  { label: 'Music',   path: '/music',   icon: 'graphic_eq',    searxng: 'music'   },
  { label: 'Science', path: '/science', icon: 'menu_book',     searxng: 'science' },
  { label: 'Files',   path: '/files',   icon: 'folder_zip',    searxng: 'files'   },
];

export default function CategoryNav({ query }: CategoryNavProps) {
  const location = useLocation();

  return (
    <div className="flex items-center overflow-x-auto scrollbar-none gap-space-2xs bg-surface-container-lowest border-b border-outline-variant px-gutter">
      {categories.map((cat) => {
        const isActive = location.pathname === cat.path;
        const href = query ? `${cat.path}?q=${encodeURIComponent(query)}` : cat.path;
        return (
          <Link
            key={cat.label}
            to={href}
            className={`flex items-center gap-1 px-space-sm py-space-sm whitespace-nowrap font-label-md text-label-md border-b-2 transition-colors duration-150 ${
              isActive
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}
