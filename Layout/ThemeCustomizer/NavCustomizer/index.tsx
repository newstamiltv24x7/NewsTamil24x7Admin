import { Href, ImagePath, QuickOption } from "@/Constant";
import { Nav, NavLink } from "reactstrap";
import NavLinks from "./NavLinks";
import { NavCustomizerType } from "@/Types/ThemeCustomizerTypes";

const NavCustomizer: React.FC<NavCustomizerType> = ({ callbackNav, selected }) => {
  return (
    <Nav className="flex-column nac-pills">
      <NavLink className={`${selected === "sidebar-type" ? "active" : ""}`} onClick={() => callbackNav("sidebar-type", true)} href={Href}>
        <div className="settings">
          <img className="img-fluid" src={`${ImagePath}/customizer/1.png`} alt="icons" />
        </div>
        <span>{QuickOption}</span>
      </NavLink>
      {/* <NavLinks /> */}
    </Nav>
  );
};

export default NavCustomizer;