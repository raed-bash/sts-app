import { useLocation } from "react-router";
import AppLink, { type AppLinkProps } from "../AppLink";
import HomeIcon from "src/assets/icons/home.svg?react";
import ArrowLineDownIcon from "src/assets/icons/arrow-line-down.svg?react";
import IconButton, { type IconButtonProps } from "../buttons/IconButton";
import { Fragment, useState } from "react";
import Animation from "../Animation";
import { UserPages } from "src/pages/users/users.pages";
import type { AppPageNestedPages, AppPageSidebar } from "src/types/app-page";

type Category = {
  title: string;
  links: AppPageSidebar[];
};

const categories: Category[] = [
  {
    title: "Menu",
    links: [
      {
        key: "home",
        to: "home",
        label: "Home",
        Icon: <HomeIcon />,
        sidebar: true,
      },
      UserPages.users,
    ],
  },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  return (
    <div className="w-[280px] bg-(--surface) top-0 text-(--text) h-full fixed z-100 shadow-base">
      <div className="flex justify-between items-center py-6 px-4">
        <h1 className="text-xl font-semibold text-(--text)">
          Student Testing System
        </h1>
      </div>
      {categories.map((category) => (
        <div key={category.title}>
          <div className="ps-8 my-4 text-xs uppercase text-(--text-muted) font-medium">
            {category.title}
          </div>
          <SidebarLinks
            expanded={expanded}
            setExpanded={setExpanded}
            links={category.links}
          />
        </div>
      ))}
    </div>
  );
}

export type SidebarNestedLinksProps = { links: AppPageNestedPages["pages"] };

function SidebarNestedLinks({ links }: SidebarNestedLinksProps) {
  const location = useLocation();
  return (
    <div className="flex flex-col text-(--text-muted) ">
      {links.map((link) =>
        link.to ? (
          <SidebarNestedLink
            key={link.label}
            to={link.to}
            aria-selected={location.pathname.startsWith(`/${link.to}`)}
            className=" not-last:border-b border-(--primary)/20"
          >
            <span className="rounded-full bg-(--text-muted) w-[7px] h-[7px] me-2"></span>
            {link.label}
          </SidebarNestedLink>
        ) : (
          <></>
        ),
      )}
    </div>
  );
}

export type SidebarLinksProps = {
  setExpanded: React.Dispatch<React.SetStateAction<Set<string>>>;
  expanded: Set<string>;
  links: AppPageSidebar[];
};

function SidebarLinks({ setExpanded, expanded, links }: SidebarLinksProps) {
  const location = useLocation();

  const handleExpand = (name: string) => {
    setExpanded((oldExpanded) => {
      const newExpanded = new Set(oldExpanded);

      if (newExpanded.has(name)) {
        newExpanded.delete(name);
      } else {
        newExpanded.add(name);
      }

      return newExpanded;
    });
  };

  return (
    <div className="flex flex-col text-(--text-muted) ">
      {links.map((link) => {
        if (link.to) {
          return (
            <SidebarLink
              key={link.label}
              to={link.to}
              aria-selected={location.pathname.startsWith(`/${link.to}`)}
            >
              {link.Icon && <span className="me-2">{link.Icon}</span>}

              {link.label}
            </SidebarLink>
          );
        }

        if (link.to === undefined) {
          return (
            <Fragment key={link.key}>
              <SidebarButton
                key={link.label}
                aria-expanded={
                  expanded.has(link.key) ||
                  link.pages.some((link) =>
                    location.pathname.startsWith(`/${link.to}`),
                  )
                }
                onClick={() => handleExpand(link.key)}
              >
                <span className="flex gap-2 items-center">
                  {link.Icon}
                  {link.label}
                </span>
                <ArrowLineDownIcon className="justify-self-end -rotate-90 " />
              </SidebarButton>
              <Animation
                isOpen={expanded.has(link.key)}
                duration={300}
                notOpenClassName="h-0"
                className="overflow-hidden "
                openStyle={{ height: `${link.pages.length * 50}px` }}
              >
                <SidebarNestedLinks links={link.pages} />
              </Animation>
            </Fragment>
          );
        }
      })}
    </div>
  );
}

const SidebarButton = (props: IconButtonProps) => (
  <IconButton
    {...props}
    className={`
              hover:bg-(--secondary)/20 duration-150 ease-in-out cursor-pointer p-2 flex items-center
              w-full relative justify-between rounded-none py-3 px-6 fill-(--text) [&>svg]:stroke-(--text) text-sm 
              aria-expanded:bg-(--secondary)/30 aria-expanded:fill-(--text) aria-expanded:text-(--text)  
              after:content-[''] after:absolute after:top-0 after:left-0 aria-expanded:after:h-full after:w-1 after:bg-(--accent) after:h-0 after:duration-200 
              aria-expanded:[&>svg]:rotate-0 [&>svg]:duration-150 has-[aria-selected=true]:bg-red-500
               ${props.className}`}
  />
);

const SidebarLink = (props: AppLinkProps) => (
  <AppLink
    {...props}
    className={`no-underline  
              hover:bg-(--secondary)/20 duration-150 ease-in-out cursor-pointer p-2 flex items-center
              w-full relative justify-start rounded-none py-3 px-6 fill-(--text-muted) text-sm 
              aria-selected:bg-(--secondary)/30 aria-selected:fill-(--text) aria-selected:text-(--text)  
              after:content-[''] after:absolute after:top-0 after:left-0 aria-selected:after:h-full after:w-1 after:bg-(--accent) after:h-0 after:duration-200 
               ${props.className}`}
  />
);

const SidebarNestedLink = (props: AppLinkProps) => (
  <AppLink
    {...props}
    className={`no-underline bg-(--secondary)/15
              ease-in-out cursor-pointer p-2 flex items-center
               w-full relative justify-start rounded-none py-3 px-6 fill-(--text-muted) text-sm 
               hover:ps-9 duration-300 aria-selected:ps-9 
              aria-selected:fill-(--text) aria-selected:bg-(--accent)/25 aria-selected:[&>span]:bg-(--accent) 
               ${props.className}`}
  />
);
