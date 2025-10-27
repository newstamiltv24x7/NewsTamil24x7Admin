import { MobileView } from "./MobileView";
import { UserInfo } from "./UserInfo";
import { Profile } from "./Profile";
import { Row } from "reactstrap";
import { useAppSelector } from "@/Redux/Hooks";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const getBread = (parent: string, child: string) => {
  return { parent: parent, title: child };
};

const Header = () => {
  const { toggleSidebar } = useAppSelector((state) => state.layout);
  const pathname = usePathname();

  const [bread, setBread] = useState({
    parent: "",
    title: "",
  });

  useEffect(() => {
    if (pathname?.includes("create_story")) {
      setBread({ ...bread, parent: "Editorial", title: "Create Story" });
    } else if (pathname?.includes("edit_story")) {
      setBread({ ...bread, parent: "Editorial", title: "Edit Story" });
    } else if (pathname?.includes("main_category")) {
      setBread({ ...bread, parent: "Master", title: "Main Category" });
    } else if (pathname?.includes("secondary_category")) {
      setBread({ ...bread, parent: "Master", title: "Secondary Category" });
    } else if (pathname?.includes("youtube")) {
      setBread({ ...bread, parent: "Master", title: "Live Stream" });
    }else if (pathname?.includes("youtubevideo")) {
      setBread({ ...bread, parent: "Master", title: "Youtube Video" });
    }else if (pathname?.includes("youtubeshorts")) {
      setBread({ ...bread, parent: "Master", title: "Youtube Shorts" });
    } else if (pathname === "/en/ads") {
      setBread({ ...bread, parent: "Ad Management", title: "Ads List" });
    } else if (pathname?.includes("create-ad")) {
      setBread({ ...bread, parent: "Ads", title: "Create Advertisement" });
    } else if (pathname?.includes("edit-ad")) {
      setBread({ ...bread, parent: "Ads", title: "Edit Advertisement" });
    } else if (pathname?.includes("web-stories")) {
      setBread({ ...bread, parent: "Web Stories", title: "" });
    }else if (pathname?.includes("cards")) {
      setBread({ ...bread, parent: "Cards", title: "" });
    } else if (pathname === "/en/listicles") {
      setBread({ ...bread, parent: "Listicles List", title: "" });
    } else if (pathname?.includes("create-listicle")) {
      setBread({
        ...bread,
        parent: "Listicles List ",
        title: "Create Listicle",
      });
    } else if (pathname?.includes("edit-listicle")) {
      setBread({
        ...bread,
        parent: "Listicles List ",
        title: "Edit Listicle",
      });
    } else if (pathname === "/en/live-blog") {
      setBread({ ...bread, parent: "Editorial", title: "Live Blog List" });
    } else if (pathname?.includes("create-live-blog")) {
      setBread({
        ...bread,
        parent: "Live Blog List ",
        title: "Create Live Blog",
      });
    } else if (pathname?.includes("edit-blog")) {
      setBread({
        ...bread,
        parent: "Live Blog List ",
        title: "Edit Live Blog",
      });
    } else if (pathname?.includes("system-management/categories")) {
      setBread({
        ...bread,
        parent: "System Management ",
        title: "Categories",
      });
    } else if (pathname === "/en/ad-txt") {
      setBread({
        ...bread,
        parent: "Ad Management ",
        title: "Ad Txt",
      });
    } else if (pathname === "/en/ad-txt-app") {
      setBread({
        ...bread,
        parent: "Ad Management ",
        title: "App Ad Txt",
      });
    } else if (pathname?.includes("robots-txt")) {
      setBread({
        ...bread,
        parent: "SEO Management ",
        title: "Robots txt",
      });
    } else if (pathname === "/en/seo-setup") {
      setBread({
        ...bread,
        parent: "SEO Management ",
        title: "SEO Setup",
      });
    } else if (pathname === "/en/web&app-config/tags") {
      setBread({
        ...bread,
        parent: "Web & App Configs",
        title: "Tags",
      });
    } else if (pathname === "/en/seo-setup/manage-seo") {
      setBread({
        ...bread,
        parent: "SEO Management",
        title: "Manage SEO",
      });
    } else if (pathname === "/en/redirect-url") {
      setBread({
        ...bread,
        parent: "Redirect URL",
        title: "",
      });
    }  else if (pathname === "/en/social-handles") {
      setBread({
        ...bread,
        parent: "Social Handles",
        title: "",
      });
    } else if (pathname === "/en/form-name") {
      setBread({
        ...bread,
        parent: "Form Name",
        title: "",
      });
    } else if (pathname === "/en/email-template") {
      setBread({
        ...bread,
        parent: "Email Template",
        title: "",
      });
    } else if (pathname === "/en/user-management/permission") {
      setBread({
        ...bread,
        parent: "User Management",
        title: "Role Privilege",
      });
    } else if (pathname === "/en/user-management/user") {
      setBread({
        ...bread,
        parent: "User Management",
        title: "User Privilege",
      });
    } else if (pathname === "/en/change-password") {
      setBread({
        ...bread,
        parent: "Change Password",
        title: "",
      });
    }else if (pathname === "/en/polls") {
      setBread({
        ...bread,
        parent: "Editorial",
        title: "Polls",
      });
    }else if (pathname === "/en/master/main_category") {
      setBread({
        ...bread,
        parent: "Master",
        title: "Main category",
      });
    }else if (pathname === "/en/master/special-category") {
      setBread({
        ...bread,
        parent: "Master",
        title: "Special category",
      });
    }else if (pathname === "/en/control") {
      setBread({
        ...bread,
        parent: "User Management",
        title: "Control News",
      });
    } else if (pathname === "/en/photos") {
      setBread({ ...bread, parent: "Editorial", title: "Photos List" });
    } else if (pathname?.includes("create-photos")) {
      setBread({
        ...bread,
        parent: "Photos List ",
        title: "Create Photos",
      });
    } else if (pathname?.includes("edit-photos")) {
      setBread({
        ...bread,
        parent: "Photos List ",
        title: "Edit Photos",
      });
    }else if (pathname === "/en/static-pages") {
      setBread({
        ...bread,
        parent: "Static Pages",
        title: "Static Pages List",
      });
    }else if (pathname?.includes("/en/comments")) {
      setBread({
        ...bread,
        parent: "Comments ",
        title: "Comments List",
      });
    } else {
      setBread({
        parent: "Editorial",
        title: "Story",
      });
    }
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 992) {
        document.getElementById("page-headers")?.classList.add("close_icon");
        document
          .getElementById("sidebar-wrappers")
          ?.classList.add("close_icon");
      } else {
        document.getElementById("page-headers")?.classList.remove("close_icon");
        document
          .getElementById("sidebar-wrappers")
          ?.classList.remove("close_icon");
      }
    });
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        // Subscribe to push notifications
      }
    });
  }, []);

  return (
    <div
      className={`page-header ${toggleSidebar ? "close_icon" : ""}`}
      id="page-headers"
    >
      <Row className="header-wrapper m-0">
        <MobileView />
        <UserInfo breadCrumb={bread} />
        <Profile />
      </Row>
    </div>
  );
};

export default Header;
