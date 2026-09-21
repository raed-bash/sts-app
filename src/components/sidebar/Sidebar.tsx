import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { ChevronDown, GraduationCap } from "lucide-react";
import {
  sidebarBrand,
  sidebarCategories,
  type SidebarLink as SidebarLinkMeta,
  type SidebarSection,
} from "@/app/navigation";
import { useRole } from "@/hooks/useRole";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import AppLink from "@/shared/components/custom/AppLink";
import { translateDynamic } from "@/shared/lib/translate-dynamic";

function useIsActive() {
  const { pathname } = useLocation();

  return (to: string) => {
    const path = `/${to}`;

    return pathname === path || pathname.startsWith(`${path}/`);
  };
}

export default function Sidebar() {
  const role = useRole();

  const { t } = useTranslation();

  const categories = sidebarCategories
    .map((category) => ({
      ...category,
      links: category.links.filter(
        (link) => !link.roles || (role && link.roles.includes(role)),
      ),
    }))
    .filter((category) => category.links.length > 0);

  return (
    <SidebarPrimitive
      collapsible="icon"
      className="z-20 border-e border-sidebar-border"
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={translateDynamic(t, sidebarBrand.name)}
              render={<AppLink to={sidebarBrand.to} className="no-underline" />}
            >
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GraduationCap className="size-4" />
              </div>
              <div className="grid flex-1 text-start leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">
                  {translateDynamic(t, sidebarBrand.name)}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {translateDynamic(t, sidebarBrand.tagline)}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {categories.map((category) => (
          <SidebarGroup key={category.title}>
            <SidebarGroupLabel>
              {translateDynamic(t, category.title)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {category.links.map((link) =>
                  "to" in link ? (
                    <SidebarLink key={link.label} link={link} />
                  ) : (
                    <SidebarSectionItem key={link.key} section={link} />
                  ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator className="mx-0" />
        <SidebarUser />
      </SidebarFooter>
    </SidebarPrimitive>
  );
}

function SidebarLink({ link }: { link: SidebarLinkMeta }) {
  const isActive = useIsActive();

  const { t } = useTranslation();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={translateDynamic(t, link.label)}
        isActive={isActive(link.to)}
        render={<AppLink to={link.to} className="no-underline" />}
      >
        <link.Icon />
        <span>{translateDynamic(t, link.label)}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarSectionItem({ section }: { section: SidebarSection }) {
  const isActive = useIsActive();
  const { state, setOpen } = useSidebar();

  const { t } = useTranslation();

  const sectionActive = section.pages.some((page) => isActive(page.to));

  const [open, setSectionOpen] = useState(sectionActive);

  useEffect(() => {
    if (sectionActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSectionOpen(true);
    }
  }, [sectionActive]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (state === "collapsed") {
      setOpen(true);
      setSectionOpen(true);
      return;
    }

    setSectionOpen(nextOpen);
  };

  return (
    <Collapsible
      open={open}
      onOpenChange={handleOpenChange}
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger
        render={
          <SidebarMenuButton
            tooltip={translateDynamic(t, section.label)}
            isActive={sectionActive}
          />
        }
      >
        <section.Icon />
        <span>{translateDynamic(t, section.label)}</span>
        <ChevronDown
          className={`ms-auto transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
            open ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {section.pages.map((page) => (
            <SidebarMenuSubItem key={page.to}>
              <SidebarMenuSubButton
                isActive={isActive(page.to)}
                render={<AppLink to={page.to} className="no-underline" />}
              >
                <page.Icon />
                <span>{translateDynamic(t, page.label)}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}

function SidebarUser() {
  const { user } = useAuthContext();

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" tooltip={user?.username}>
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground uppercase">
            {initials}
          </div>
          <div className="grid flex-1 text-start leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-medium">{user?.username}</span>
            <span className="truncate text-xs text-sidebar-foreground/70">
              {user?.role}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
