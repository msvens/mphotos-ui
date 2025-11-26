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
    <div className="w-full sm:w-64 flex-shrink-0 sm:border-r border-mui-divider">
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
                    ? 'bg-[#455a64] text-white'
                    : 'text-mui-text-secondary hover:text-mui-text-primary hover:bg-[#303030]'
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