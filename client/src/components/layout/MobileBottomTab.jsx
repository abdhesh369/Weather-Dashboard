import { motion } from 'framer-motion';
import { Cloud, Search, User, Star } from 'lucide-react';

export default function MobileBottomTab({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'weather', icon: Cloud, label: 'Weather' },
    { id: 'search',  icon: Search, label: 'Search' },
    { id: 'favs',    icon: Star,  label: 'Saved' },
    { id: 'profile', icon: User,   label: 'Profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none">
      <div className="glass h-[64px] rounded-[24px] flex items-center justify-around px-2 pointer-events-auto shadow-2xl border border-white/10">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="relative flex flex-col items-center justify-center gap-1 w-16 h-full border-none bg-transparent cursor-pointer"
            >
              <div className={`transition-all duration-300 ${isActive ? 'text-brand-primary -translate-y-1' : 'text-white/40'}`}>
                <Icon size={22} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${isActive ? 'text-white opacity-100' : 'text-white/30 opacity-0'}`}>
                {label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -top-1 w-1 h-1 bg-brand-primary rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
