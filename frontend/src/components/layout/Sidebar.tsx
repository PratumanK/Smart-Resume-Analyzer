import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSearch,
  History,
  LogOut,
  Sparkles,
  FileCheck2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/analysis/new',
      label: 'New Analysis',
      icon: FileSearch,
      end: false,
    },
    {
      to: '/history',
      label: 'Analysis History',
      icon: History,
      end: false,
    },
  ];

  return (
    <aside className="w-64 h-full bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 select-none">
      <div>
        {/* Brand / Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/30">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              Resume Analyser
            </span>
            <span className="text-[10px] text-brand-300 font-medium uppercase tracking-wider block">
              AI ATS Scoring
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Workspace
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer / User Profile & Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-brand-700 text-white font-semibold text-xs flex items-center justify-center flex-shrink-0">
            {user?.userName ? user.userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {user?.userName || 'User'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>

        <div className="mt-3 px-3 py-2 rounded bg-slate-950/40 border border-slate-800/80 text-[10px] text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-brand-400 flex-shrink-0" />
          <span>Powered by NLP & LLM</span>
        </div>
      </div>
    </aside>
  );
};
