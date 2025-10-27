import { useAppSelector } from "@/Redux/Hooks";
import { Fragment, useEffect, useState } from "react";
import Menulist from "./Menulist";
import { MenuList } from "@/Data/Layout/Menu";
import { MenuItem } from "@/Types/LayoutTypes";
import { useTranslation } from "@/app/i18n/client";
import { getSideBarMenu } from "@/apiFunctions/ApiAction";

const SidebarMenuList = () => {
  const [activeMenu, setActiveMenu] = useState([]);
  const [sideMenuList, setSideMenuList] = useState([]);
  const { pinedMenu } = useAppSelector((state) => state.layout);
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const shouldHideMenu = (mainMenu: MenuItem) => {
    return mainMenu?.Items?.map((data) => data.title).every((titles) =>
      pinedMenu.includes(titles || "")
    );
  };

  const GetSideMenu = async () => {
    try {
      const res = await getSideBarMenu();
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
    GetSideMenu();
  }, []);

  return (
    <>
      {sideMenuList &&
        sideMenuList.map((mainMenu: MenuItem, index) => (
          <Fragment key={index}>
            <li
              className={`sidebar-main-title ${
                shouldHideMenu(mainMenu) ? "d-none" : ""
              }`}
            >
              <h6 className={mainMenu.lanClass && mainMenu.lanClass}>
                {t(mainMenu.title)}
              </h6>
            </li>
            <Menulist
              menu={mainMenu.Items}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              level={0}
            />
          </Fragment>
        ))}
    </>
  );
};

export default SidebarMenuList;
