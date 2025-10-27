import { MenuItem } from "@/Types/LayoutTypes";

export const MenuList: MenuItem[] | undefined = [
  {
    title: "General",
    lanClass: "lan-8",
    menucontent: "General",
    Items: [
      {
        title: "Master",
        id: 1,
        type: "sub",
        active: false,
        children: [
          {
            path: "/master/main_category",
            type: "link",
            title: "Main Category",
          },
          // {
          //   path: "/master/secondary_category",
          //   type: "link",
          //   title: "Sub Category",
          // },
          {
            path: "/master/youtube",
            type: "link",
            title: "Youtube Stream",
          },
        ],
      },
      {
        title: "User Management",
        id: 2,
        type: "sub",
        active: false,
        children: [
          {
            path: "/user-management/user",
            type: "link",
            title: "User Privilege",
          },
          {
            path: "/user-management/permission",
            type: "link",
            title: "Role Privilege",
          },
        ],
      },
      {
        title: "Editorial",
        id: 3,
        type: "sub",
        active: false,
        children: [
          { path: "/story", type: "link", title: "Story" },
          { path: "/web-stories", type: "link", title: "Web Stories" },
          { path: "/listicles", type: "link", title: "Listicles" },
          { path: "/live-blog", type: "link", title: "Live Blog" },
        ],
      },

      {
        title: "Ad Management",
        id: 4,
        type: "sub",
        active: false,
        children: [
          {
            path: "/ads",
            type: "link",
            title: "Ads List",
          },
          {
            path: "/ad-txt",
            type: "link",
            title: "Ads.txt",
          },
          {
            path: "/ad-txt-app",
            type: "link",
            title: "Ads.txt for App",
          },
        ],
      },
      {
        title: "SEO Management",
        id: 5,
        type: "sub",
        active: false,
        children: [
          {
            path: "/robots-txt",
            type: "link",
            title: "Robots.txt",
          },
          {
            path: "/seo-setup/manage-seo",
            type: "link",
            title: "SEO Setup",
          },
        ],
      },

      // {
      //   title: "System Management",
      //   id: 3,
      //   type: "sub",
      //   active: false,
      //   children: [
      //     {
      //       path: "/system-management/categories",
      //       type: "link",
      //       title: "Categories",
      //     },
      //   ],
      // },
      {
        title: "Web & App Configs",
        id: 6,
        type: "sub",
        active: false,
        children: [
          {
            path: "/web&app-config/tags",
            type: "link",
            title: "Tags",
          },
        ],
      },
      {
        title: "Web Components",
        id: 7,
        type: "sub",
        active: false,
        path: "/web-components",
      },
      {
        title: "Redirect URL",
        id: 8,
        type: "sub",
        active: false,
        path: "/redirect-url",
      },
      // {
      //   title: "H-Rules",
      //   id: 9,
      //   type: "sub",
      //   active: false,
      //   path: "/h-rules",
      // },
      {
        title: "Email Template",
        id: 10,
        type: "sub",
        active: false,
        path: "/email-template",
      },
      {
        title: "Trending Tags",
        id: 11,
        type: "sub",
        active: false,
        path: "/trending-tags",
      },
      {
        title: "Static Pages",
        id: 12,
        type: "sub",
        active: false,
        path: "/static-pages",
      },
      // {
      //   title: "Form Name",
      //   id: 13,
      //   type: "sub",
      //   active: false,
      //   path: "/form-name",
      // },
      // {
      //   title: "Collections",
      //   id: 14,
      //   type: "sub",
      //   active: false,
      //   path: "/collections",
      // },
      {
        title: "Social Media Handles",
        id: 15,
        type: "sub",
        active: false,
        path: "/social-handles",
      },
    ],
  },
];
