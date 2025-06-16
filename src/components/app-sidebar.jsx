import { Calendar, ChevronRight, Inbox, Search, Settings, Settings2Icon } from "lucide-react";
import { RiCoupon3Line } from "react-icons/ri";
import { LuLayoutDashboard } from "react-icons/lu";

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
        <div className="text-lg font-bold px-4 py-2">Code Vouchers</div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {sidebarSections
            .filter(
              (section) => !section.roles || section.roles.includes(role || "")
            )
            .map((section) =>
              section.items ? (
                // Expandable item
                <Collapsible key={section.title}>
                  <SidebarMenuItem className="p-0">
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors group">
                        <div className="flex items-center gap-2">
                          <section.icon className="h-4 w-4 text-muted-foreground" />
                          <span>{section.title}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                      </button>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-4">
                      {section.items.map((sub) => (
                        <SidebarMenuSubItem key={sub.href}>
                          <a
                            href={sub.href}
                            className="flex items-center gap-2 w-full px-3 py-1.5 rounded-md text-sm hover:bg-muted transition-colors"
                          >
                            {sub.icon && (
                              <sub.icon className="h-4 w-4 text-muted-foreground" />
                            )}
                            {sub.label}
                          </a>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                // Direct link item
                <SidebarMenuItem key={section.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={section.href}
                      className="flex items-center gap-2 w-full px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                    >
                      <section.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{section.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
