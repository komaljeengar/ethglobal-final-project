import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Shield,
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Stethoscope,
  User,
  Bell,
  ChevronDown,
  Heart,
  Search,
} from "lucide-react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/ui/footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoading, isInitialized } = useAuth();

  // Prevent any black hover states in sidebar
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .sidebar-override *:focus {
        outline: none !important;
        box-shadow: none !important;
      }
      .sidebar-override button:focus,
      .sidebar-override a:focus {
        background-color: transparent !important;
        color: inherit !important;
      }
      .sidebar-override [data-radix-popper-content-wrapper] {
        z-index: 50 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const patientNavItems = [
    { title: "Dashboard", url: "/patient/dashboard", icon: LayoutDashboard },
    { title: "Medical Records", url: "/patient/records", icon: FileText },
    { title: "Permissions", url: "/patient/permissions", icon: Users },
    { title: "AI Health Chat", url: "/patient/ai-chat", icon: MessageSquare },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const doctorNavItems = [
    { title: "Dashboard", url: "/doctor/dashboard", icon: LayoutDashboard },
    { title: "Patients", url: "/doctor/patients", icon: User },
    {
      title: "Clinical Support",
      url: "/doctor/clinical-support",
      icon: MessageSquare,
    },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  // Don't show navigation until we know the user role to prevent flashing
  const navItems = user?.role === "doctor" ? doctorNavItems : patientNavItems;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const AppSidebar = () => {
    const currentPath = location.pathname;

    // Show loading state during initialization
    if (!isInitialized || isLoading) {
      return (
        <Sidebar
          className="w-64 bg-white border-r border-purple-200 shadow-lg sidebar-override"
          collapsible="icon"
        >
          <SidebarContent className="bg-white">
            {/* Logo */}
            <div className="p-6 border-b border-purple-200 bg-white">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-purple-900">
                  dr Hedera
                </span>
              </div>
            </div>

            {/* Loading placeholder */}
            <div className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-purple-100 rounded"></div>
                <div className="h-4 bg-purple-100 rounded"></div>
                <div className="h-4 bg-purple-100 rounded"></div>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>
      );
    }

    const isActive = (path: string) => currentPath === path;
    const getNavCls = (path: string) =>
      isActive(path)
        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:from-purple-600 hover:to-purple-700 border-l-4 border-purple-300 rounded-r-lg focus:from-purple-600 focus:to-purple-700"
        : "text-purple-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-purple-50 hover:text-purple-700 hover:font-semibold hover:border-l-4 hover:border-purple-400 hover:rounded-r-lg hover:shadow-sm transition-all duration-300 focus:bg-purple-50 focus:text-purple-700";

    return (
      <Sidebar
        className="w-64 bg-white border-r border-purple-200 shadow-lg sidebar-override"
        collapsible="icon"
      >
        <SidebarContent className="bg-white">
          {/* Logo */}
          <div className="p-6 border-b border-purple-200 bg-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-purple-900">
                dr Hedera
              </span>
            </div>
          </div>

          <SidebarGroup className="bg-white py-4">
            <SidebarGroupLabel className="text-purple-700 font-semibold bg-white px-4 mb-3">
              {user?.role === "doctor" ? "Clinical Tools" : "Your Health"}
            </SidebarGroupLabel>
            <SidebarGroupContent className="bg-white">
              <SidebarMenu className="bg-white">
                {navItems.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    className="bg-white mb-3 px-2"
                  >
                    <SidebarMenuButton
                      asChild
                      className="bg-white p-0 w-full hover:bg-transparent focus:bg-transparent"
                    >
                      <NavLink
                        to={item.url}
                        className={`${getNavCls(
                          item.url
                        )} transition-all duration-300 py-4 pl-4 pr-4 flex items-center w-full focus:outline-none focus:ring-0`}
                      >
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        <span className="text-sm font-medium hover:font-semibold transition-all duration-300">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* {user?.role === "patient" && (
            <SidebarGroup className="bg-white py-4 mt-4 border-t border-purple-100">
              <SidebarGroupLabel className="text-purple-700 font-semibold bg-white px-4 mb-3">
                Emergency
              </SidebarGroupLabel>
              <SidebarGroupContent className="bg-white">
                <SidebarMenu className="bg-white">
                  <SidebarMenuItem className="bg-white mb-3 px-2">
                    <SidebarMenuButton className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:font-medium hover:border-l-4 hover:border-red-300 hover:rounded-r-lg transition-all duration-300 py-4 pl-4 pr-4 flex items-center w-full focus:outline-none focus:bg-red-50 focus:text-red-700">
                      <Heart className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">Emergency Access</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )} */}

          {/* Profile Section */}
          <div className="mt-auto bg-white border-t border-purple-100">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-sm font-semibold">
                    {user?.avatar || user?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-purple-900 truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-purple-600 truncate">
                    {user?.role === "doctor"
                      ? user?.specialization || "Doctor"
                      : user?.email || "Patient"}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-purple-50"
                    >
                      <Settings className="h-4 w-4 text-purple-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white border border-purple-200 shadow-lg rounded-lg p-1"
                  >
                    <DropdownMenuItem
                      onClick={() => navigate("/settings")}
                      className="hover:bg-purple-50 focus:bg-purple-50 rounded-md cursor-pointer text-purple-900"
                    >
                      <Settings className="w-4 h-4 mr-2 text-purple-600" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-purple-100 my-1" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-md cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2 text-red-500" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-100 via-white to-purple-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* <header className="glass-header sticky top-0 z-40">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div className="hidden md:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search medical records..."
                      className="glass-input pl-10 pr-4 py-2 w-80 rounded-lg text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">

                <Badge className={`medical-badge ${
                  user?.role === 'doctor' 
                    ? 'medical-info' 
                    : 'medical-success'
                }`}>
                  {user?.role === 'doctor' ? (
                    <><Stethoscope className="w-3 h-3 mr-1" /> Doctor</>
                  ) : (
                    <><User className="w-3 h-3 mr-1" /> Patient</>
                  )}
                </Badge>

                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                  <Bell className="w-4 h-4" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-primary/10">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-primary text-white text-xs">
                          {user?.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.specialization || user?.email}
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass-card">
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-primary/10">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-red-500/10">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header> */}

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="bg-white border-t border-purple-100 py-4 px-6">
            <div className="flex items-center justify-center text-center">
              <p className="text-xs text-purple-600">
                © 2024 dr Hedera - Licensed under MIT | Secure Healthcare Data
                Management Platform | All rights reserved
              </p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
