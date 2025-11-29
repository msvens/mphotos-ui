'use client';

export interface MenuItem {
  id: string;
  name: string;
}

interface SideMenuProps {
  items: MenuItem[];
  activeItem: string;
  onItemChange: (itemId: string) => void;
}

export function SideMenu({ items, activeItem, onItemChange }: SideMenuProps) {
  return (
    <div className="w-full sm:w-64 flex-shrink-0 mb-6 sm:mb-0 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700">
      <div className="sm:sticky sm:top-24">
        <nav className="py-2 sm:pr-2">
          {items.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onItemChange(item.id)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}