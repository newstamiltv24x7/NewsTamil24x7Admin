import SVG from "@/CommonComponent/SVG";
import { Href } from "@/Constant";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { handlePined } from "@/Redux/Reducers/LayoutSlice";
import { MenuListType, SidebarItemTypes } from "@/Types/LayoutTypes";
import { useTranslation } from "@/app/i18n/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Badge from '@mui/material/Badge';

const role_name = Cookies.get("role_name")

const Menulist: React.FC<MenuListType> = ({ menu, setActiveMenu, activeMenu, level, className }) => {
  const { pinedMenu } = useAppSelector((state) => state.layout);
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { sidebarIconType } = useAppSelector((state) => state.themeCustomizer)

 const ActiveNavLinkUrl = (path?: string, active?: boolean) => {
  return pathname.split(`${i18LangStatus}`)[1] === path ? (active ? active : true) : "";
};

  const shouldSetActive = ({ item }: SidebarItemTypes) => {
    var returnValue = false;
    if (item?.path === pathname.split(`${i18LangStatus}`)[1]) {
      returnValue = true;
    }
    if (!returnValue && item?.children) {
      item?.children.every((subItem) => {
        returnValue = shouldSetActive({ item: subItem });
        return !returnValue;
      });
    }
    return returnValue;
  };

  useEffect(() => {
    menu?.forEach((item: any) => {
      let gotValue = shouldSetActive({ item });
      if (gotValue) {
        let temp = [...activeMenu];
        temp[level] = t(item.title);
        setActiveMenu(temp);
      }
    });
  }, []);

  return (
    <>
      {menu?.map((item, index) => (
        <li key={index} className={`${level === 0 ? "sidebar-list" : ""} ${pinedMenu.includes(item.title || "") ? "pined" : ""}  ${(item.children ? item.children.map((innerItem) => ActiveNavLinkUrl(innerItem.path)).includes(true) : ActiveNavLinkUrl(item.path)) || activeMenu[level] === item.title ? "active" : ""} `}>
          {level === 0 && <i className="fa fa-thumb-tack" onClick={() => dispatch(handlePined(item.title))}></i>}
          {role_name !== "admin" && role_name !== "super-admin" &&  t(item.title) === "User Management" ? (
             <></>
          ) :(
            <Link className={`${!className && level !== 2 ? "sidebar-link sidebar-title" : ""}  ${(item.children ? item.children.map((innerItem) => ActiveNavLinkUrl(innerItem.path)).includes(true) : ActiveNavLinkUrl(item.path)) || activeMenu[level] === item.title ? "active" : ""}`}
            href={item?.path ? `/${i18LangStatus}${item?.path}` : ""}
            onClick={() => {
              const temp = activeMenu;
              temp[level] = item.title !== temp[level] && item.title;
              setActiveMenu([...temp]);
            }}>
            {item.icon && (<SVG className={`${sidebarIconType}-icon`} iconId={`${sidebarIconType}-${item.icon}`} />)}
            
            <span className={item.lanClass && item.lanClass}>{t(item.title)}</span>
            
            {item.active === true  && <div className="according-menu">
                 <i className="fa fa-angle-right" />
            </div>
            }
           
           
            
           
          </Link>
          ) }
          
          {item.children && (
            <ul className={`sidebar-submenu ${level !== 0 ? "nav-sub-childmenu submenu-content" : ""}`}>
            
             <Menulist menu={item.children} activeMenu={activeMenu} setActiveMenu={setActiveMenu} level={level + 1} className="sidebar-submenu" />
       
             
            </ul>
          )}
        </li>
      ))}
    </>
  );
};

export default Menulist;
