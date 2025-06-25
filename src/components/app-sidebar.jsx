import {
  Ambulance,
  Calendar,
  ChevronRight,
  Inbox,
  MergeIcon,
  Search,
  Settings,
  Settings2Icon,
  Store,
} from "lucide-react";
import { RiCoupon3Line } from "react-icons/ri";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoStorefrontOutline } from "react-icons/io5";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { FaNetworkWired } from "react-icons/fa";

// Menu links.
const sidebarSections = [
  {
    title: "Management",
    icon: LuLayoutDashboard,
    roles: ["admin", "owner"],
    items: [
      { label: "Dashboard", icon: LuLayoutDashboard, href: "/dashboard" },
      { label: "Inbox", icon: LuLayoutDashboard, href: "/inbox" },
    ],
  },
  {
    title: "Merchants",
    icon: IoStorefrontOutline,
    roles: ["admin", "owner"],
    href: "/merchants",
  },
  {
    title: "Networks",
    icon: FaNetworkWired,
    roles: ["admin", "owner"],
    href: "/networks",
  },
  {
    title: "Settings",
    icon: Settings2Icon,
    roles: ["admin", "owner"],
    href: "/dashboard",
  },
  {
    title: "Configuration",
    icon: Settings,
    roles: ["admin"],
    items: [
      { label: "Calendar", icon: LuLayoutDashboard, href: "/calendar" },
      { label: "General Settings", icon: LuLayoutDashboard, href: "/setings" },
    ],
  },
];

export function AppSidebar({ role }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton size="lg" className="">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-600">
            <Ambulance className="size-6" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Coupons</span>
            <span className="truncate text-xs">Code vouchers</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sidebarSections
            .filter(
              (section) => !section.roles || section.roles.includes(role || "")
            )
            .map((section) =>
              section.items ? (
                <Collapsible key={section.title}>
                  <SidebarMenuItem className="p-0">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="w-full px-3 py-2 text-sm font-medium hover:bg-muted transition-colors group">
                        <div className="flex items-center gap-2">
                          <section.icon className="size-5 text-muted-foreground" />
                          <span className="truncate transition-all duration-300 group-data-[collapsed=true]:w-0 group-data-[collapsed=true]:opacity-0">
                            {section.title}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 ml-auto transition-transform duration-200 group-data-[state=open]:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-4">
                      {section.items.map((sub) => (
                        <SidebarMenuSubItem key={sub.href}>
                          <Link
                            href={sub.href}
                            className="flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-sm hover:bg-muted transition-colors"
                          >
                            {sub.icon && (
                              <sub.icon className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="truncate transition-all duration-300 group-data-[collapsed=true]:w-0 group-data-[collapsed=true]:opacity-0">
                              {sub.label}
                            </span>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={section.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={section.href}
                      className="flex items-center gap-2 w-full px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                    >
                      <section.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate transition-all duration-300 group-data-[collapsed=true]:w-0 group-data-[collapsed=true]:opacity-0">
                        {section.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
