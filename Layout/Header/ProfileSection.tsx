import { ChangePassword, Href, ImagePath, Inbox, LogOut, MyProfile, Setting } from "@/Constant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Settings, User } from "react-feather";
import { Media } from "reactstrap";
import Cookies from "js-cookie";
import { useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { useAppSelector } from "@/Redux/Hooks";

export const ProfileSection = () => {
  const router = useRouter();
  const [userName, setUserName] = useState(Cookies.get("user_name"));
  const [userRole, setUserRole] = useState(Cookies.get("role_name"));
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [open, setOpen] = useState(false);

  const LogOutUser = () => {
    Cookies.remove("riho_token");
    Cookies.remove("_token");
    Cookies.remove("_token_expiry");
    Cookies.remove("privileges");
    Cookies.remove("role_id");
    Cookies.remove("role_name");
    Cookies.remove("user_name");
    router.push("/auth/login");
  };

  return (
    <li className="profile-nav onhover-dropdown">
      <Media className="profile-media">
        {/* <img className="b-r-10" src={`${ImagePath}/dashboard/profile.png`} alt="" /> */}
        {/* <Media body className="profile-media b-r-10 d-xxl-block d-none box-col-none"> */}
        <div className="align-items-center">
          <div className="d-flex align-items-center">
            <span className="text-nowrap">{userName}</span>&nbsp;&nbsp;{" "}
            <i className="middle fa fa-angle-down"></i>
          </div>
          <div className="d-flex align-items-center">
            <span className="text-nowrap">({userRole})</span>
          </div>
        </div>

        {/* </Media> */}
      </Media>
      <ul className="profile-dropdown onhover-show-div" style={{ width: 220 }}>
        {/* <li><Link href={Href}><User /><span>{MyProfile}</span></Link></li>
        <li><Link href={Href}><Mail /><span>{Inbox}</span></Link></li> */}
        {/* <li>
          <Link href={Href}>
            <Settings />
            <span>{Setting}</span>
          </Link>
        </li> */}
        <li><Link href={`/${i18LangStatus}/change-password`}><User /><span>{ChangePassword}</span></Link></li>
        {/* <li style={{ textAlign: "center" }}>
          <Link href={`/${i18LangStatus}/change-password`}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>
              Change Password
            </span>
          </Link>
        </li> */}
        <li onClick={LogOutUser} style={{ textAlign: "center" }}>
          <Link className="btn btn-pill btn-outline-primary btn-sm" href={Href}>
            {LogOut}
          </Link>
        </li>
      </ul>
    </li>
  );
};
