import { NavLink } from "react-router-dom";
import { LayoutDashboard, LogOut, Settings, ChevronLeft, ChevronRight, Users, FolderOpen, Briefcase } from "lucide-react";
import { useAuth } from "../../context/auth";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const { member, logout } = useAuth();

  const getNavLinks = () => {
    const baseLinks = [
      { name: "Dashboard", path: "/", icon: LayoutDashboard },
    ];

    let roleLinks: any[] = [];

    if (member?.role === "Admin") {
      roleLinks = [
        { name: "Users & Roles", path: "/users", icon: Users },
        { name: "Manage Projects", path: "/admin/projects", icon: FolderOpen },
      ];
    } else if (member?.role === "User") {
      roleLinks = [
        { name: "My Projects", path: "/projects", icon: FolderOpen },
        { name: "My Tasks", path: "/tasks", icon: Briefcase },
      ];
    }

    const finalLinks = [...baseLinks, ...roleLinks];
    finalLinks.push({ name: "Settings", path: "/settings", icon: Settings });

    return finalLinks;
  };

  const navLinks = getNavLinks();

  return (
    <aside 
      className={`h-full relative border-r border-border bg-card flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      } hidden md:flex`}
    >
      {/* Toggle button */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-12 z-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      )}

      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-border px-4 mb-2 ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="bg-primary/10 p-2 rounded-xl shrink-0 transition-colors">
          <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center shadow-sm">
            <svg
              className="w-4 h-4 text-primary-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z" />
            </svg>
          </div>
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight text-foreground truncate">
            Taskflow AI
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto w-full custom-scrollbar">
        {!collapsed && (
          <div className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-4 px-3">
            Menu
          </div>
        )}
        
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all duration-200 mb-2 group relative ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              } ${collapsed ? "justify-center" : ""}`
            }
            title={collapsed ? link.name : undefined}
          >
            <link.icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${collapsed ? "" : "group-hover:scale-110"}`} />
            {!collapsed && <span className="truncate">{link.name}</span>}
            
            {collapsed && (
               <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg border border-border">
                {link.name}
               </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Action */}
      <div className="p-3 border-t border-border">
        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200 group relative ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
          onClick={logout}
        >
          <LogOut className={`w-5 h-5 shrink-0 transition-transform duration-200 ${collapsed ? "" : "group-hover:-translate-x-1"}`} />
          {!collapsed && <span>Logout</span>}
          
          {collapsed && (
             <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg border border-border">
              Logout
             </div>
          )}
        </button>
      </div>
    </aside>
  );
}
