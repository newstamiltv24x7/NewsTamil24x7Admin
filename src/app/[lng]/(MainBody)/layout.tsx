"use client";
// import Footer from "@/Layout/Footer/Footer";
import { ToastContainer } from "react-toastify";
// import ThemeCustomizer from "@/Layout/ThemeCustomizer";
import { useEffect, useState } from "react";
import { redirect, usePathname } from "next/navigation";
import Header from "Layout/Header/Header";
import { SideBar } from "Layout/SideBar/SideBar";
import TapTop from "Layout/TapTop";
import { useAppDispatch, useAppSelector } from "Redux/Hooks";
import { setToggleSidebar } from "Redux/Reducers/LayoutSlice";
import { setLayout } from "Redux/Reducers/ThemeCustomizerSlice";
import StoryPreview from "Layout/StoryPreview/StoryPreview";
import { getAllSideBarMenu } from "apiFunctions/ApiAction";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { layout } = useAppSelector((state) => state.themeCustomizer);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [sideMenuList, setSideMenuList] = useState([]);
  const [checkUrl, setCheckUrl] = useState(false);
  const compactSidebar = () => {
    let windowWidth = window.innerWidth;
    if (layout === "compact-wrapper") {
      if (windowWidth < 1200) {
        dispatch(setToggleSidebar(true));
      } else {
        dispatch(setToggleSidebar(false));
      }
    } else if (layout === "horizontal-wrapper") {
      if (windowWidth < 992) {
        dispatch(setToggleSidebar(true));
        dispatch(setLayout("compact-wrapper"));
      } else {
        dispatch(setToggleSidebar(false));
        dispatch(setLayout(localStorage.getItem("layout")));
      }
    }
  };

  useEffect(() => {
    compactSidebar();
    window.addEventListener("resize", () => {
      compactSidebar();
    });
  }, [layout]);

  const GetAllSideMenu = async () => {
    try {
      const res = await getAllSideBarMenu();
      if (res.appStatusCode === 0) {
        setSideMenuList(res.payloadJson);
      } else {
        setSideMenuList([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    GetAllSideMenu();
  }, [pathname !== ""]);

  useEffect(() => {
    if(sideMenuList. length > 0){
      var search: any = sideMenuList.filter(
        (obj: any) => obj.path === pathname?.split("/en")?.at(-1)
      );
  
  
      if(search.length > 0){
        setCheckUrl(true)
      }else{
        setCheckUrl(false)
        // redirect("/not-found")
      }
    }
    // pathname
   
  }, [sideMenuList]);

  return (
    <>
      { pathname?.includes("/story-preview/") ? (
        <StoryPreview />
      ) : (

        Array.isArray(sideMenuList) && checkUrl ?
        <div className={`page-wrapper ${layout}`} id="pageWrapper">
          <Header />
          <div className="page-body-wrapper">
            <SideBar />
            <div className="page-body">{children}</div>
          </div>
        </div> :
        <div className={`page-wrapper ${layout}`} id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <SideBar />
          <div className="page-body">{children}</div>
        </div>
      </div>


      )}
      {/* <ThemeCustomizer /> */}
      <ToastContainer />
      <TapTop />
    </>
  );
}
