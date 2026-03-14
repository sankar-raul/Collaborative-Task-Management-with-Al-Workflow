import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-secondary/50 hover:bg-secondary border border-border transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
            <div className="relative w-5 h-5 overflow-hidden">
                {/* Moon Icon */}
                <div 
                    className={`absolute inset-0 transform transition-all duration-500 ease-in-out ${
                        theme === 'light' 
                            ? 'translate-y-0 opacity-100 rotate-0' 
                            : 'translate-y-10 opacity-0 -rotate-90'
                    }`}
                >
                    <Moon className="w-5 h-5 text-slate-700" />
                </div>
                
                {/* Sun Icon */}
                <div 
                    className={`absolute inset-0 transform transition-all duration-500 ease-in-out ${
                        theme === 'dark' 
                            ? 'translate-y-0 opacity-100 rotate-0' 
                            : '-translate-y-10 opacity-0 rotate-90'
                    }`}
                >
                    <Sun className="w-5 h-5 text-amber-400" />
                </div>
            </div>
            
            {/* Tooltip (Optional, for better UX) */}
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-[10px] font-medium rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
        </button>
    );
};

export default ThemeToggle;
