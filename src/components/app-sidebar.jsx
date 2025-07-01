import {
  BadgePercent,
  ChevronRight,
  FileChartColumn,
  Globe,
  LayoutPanelLeft,
  LetterText,
  ListTreeIcon,
  MonitorCog,
  Network,
  Settings,
  UserRoundCog,
} from "lucide-react";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

// Menu links.
const sidebarSections = [
  {
    title: "Dashboard",
    icon: LuLayoutDashboard,
    roles: ["admin", "owner"],
    href: "/dashboard",
  },
  {
    title: "Merchants",
    icon: LayoutPanelLeft,
    roles: ["admin", "owner"],
    href: "/merchants",
  },
  {
    title: "Networks",
    icon: Network,
    roles: ["admin", "owner"],
    href: "/networks",
  },
  {
    title: "Country",
    icon: Globe,
    roles: ["admin", "owner"],
    href: "/country",
  },
  {
    title: "Category",
    icon: ListTreeIcon,
    roles: ["admin", "owner"],
    href: "/category",
  },
  {
    title: "Offers",
    icon: BadgePercent,
    roles: ["admin", "owner"],
    href: "/offers",
  },
  {
    title: "Site Management",
    icon: MonitorCog,
    roles: ["admin"],
    items: [
      { label: "Calendar", icon: LuLayoutDashboard, href: "/roles" },
      { label: "General Settings", icon: LuLayoutDashboard, href: "/setings" },
    ],
  },
  {
    title: "Content Management",
    icon: LetterText,
    roles: ["admin"],
    items: [
      { label: "Calendar", icon: LuLayoutDashboard, href: "/roles" },
      { label: "General Settings", icon: LuLayoutDashboard, href: "/setings" },
    ],
  },
  {
    title: "Reporting",
    icon: FileChartColumn,
    roles: ["admin"],
    items: [
      { label: "Calendar", icon: LuLayoutDashboard, href: "/roles" },
      { label: "General Settings", icon: LuLayoutDashboard, href: "/setings" },
    ],
  },
  {
    title: "Role Management",
    icon: UserRoundCog,
    roles: ["admin"],
    href: "/roles",
  },
  {
    title: "Security",
    icon: UserRoundCog,
    roles: ["admin"],
    href: "/security",
  },
  {
    title: "Settings",
    icon: Settings,
    roles: ["admin", "owner"],
    href: "/settings",
  },
];

export function AppSidebar({ role }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* <SidebarMenuButton size="lg" className=""> */}
        <div className={"flex items-center gap-2"}>
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg hover:bg-muted transition-colors">
            {/* <Ambulance className="size-6" /> */}
            <SidebarTrigger className="size-6" />
          </div>
          <div className="grid text-left text-sm leading-tight">
            <span className="truncate font-semibold">Coupons</span>
            <span className="truncate text-xs">Code vouchers</span>
          </div>
        </div>
        {/* </SidebarMenuButton> */}
      </SidebarHeader>
      <SidebarContent className="px-1">
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
                      <SidebarMenuButton className="w-full px-4 py-2 text-sm font-medium hover:bg-muted transition-colors group">
                        <div className="flex items-center gap-2">
                          <section.icon className="size-4 text-muted-foreground" />
                          <span className="truncate transition-all duration-300 group-data-[collapsed=true]:w-0 group-data-[collapsed=true]:opacity-0">
                            {section.title}
                          </span>
                        </div>
                        <ChevronRight className="size-4 ml-auto transition-transform duration-200 group-data-[state=open]:rotate-90" />
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
                              <sub.icon className="size-4 text-muted-foreground" />
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
                      <section.icon className="size-4 text-muted-foreground" />
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
