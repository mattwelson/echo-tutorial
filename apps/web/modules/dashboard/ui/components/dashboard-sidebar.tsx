"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
  SidebarFooter,
} from "@workspace/ui/components/sidebar";
import {
  CreditCard,
  Inbox,
  LayoutDashboard,
  LibraryBig,
  Mic,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";

const customerSupportItems = [
  { title: "Conversations", url: "/conversations", icon: Inbox },
  { title: "Knowledge Base", url: "/files", icon: LibraryBig },
];

const configurationItems = [
  { title: "Widget Customization", url: "/customization", icon: Palette },
  { title: "Integrations", url: "/integrations", icon: LayoutDashboard },
  { title: "Voice Assistant", url: "/plugins/vapi", icon: Mic },
];
const accountItems = [
  { title: "Plans & Billing", url: "/billing", icon: CreditCard },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  function isActive(path: string) {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname === path;
  }

  return (
    <Sidebar className="group" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <OrganizationSwitcher
                hidePersonal
                skipInvitationScreen
                appearance={{
                  elements: {
                    rootBox: "w-full! h-8!",
                    avatarBox: "size-4! rounded-sm!",
                    organizationSwitcherTrigger: cn(
                      "w-full! justify-start!",
                      "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!"
                    ),
                    organizationPreview:
                      "group-data-[collapsible=icon]:justify-center! gap-2!",
                    organizationPreviewText:
                      "group-data-[collapsible=icon]:hidden! text-xs! font-medium! text-sidebar-foreground!",
                    organizationSwitcherTriggerIcon:
                      "group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground!",
                  },
                }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerSupportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configurationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.url)}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserButton
              showName
              appearance={{
                elements: {
                  rootBox: "w-full! h-8!",
                  avatarBox: "size-4!",
                  userButtonTrigger: cn(
                    "w-full! p-2! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground!",
                    "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!"
                  ),
                  userButtonBox:
                    "w-full! flex-row-reverse! justify-end! gap-2! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!",
                  userButtonOuterIdentifier:
                    "pl-0! group-data-[collapsible=icon]:hidden!",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
