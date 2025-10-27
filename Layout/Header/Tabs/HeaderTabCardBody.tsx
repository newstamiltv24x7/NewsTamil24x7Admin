import { Href } from "@/Constant";
import { useState } from "react";
import { CardBody, Nav, NavItem, NavLink } from "reactstrap";
import { HeaderTabContent } from "./HeaderTabContent";

export const HeaderTabCardBody = () => {
  const [tabs, setTabs] = useState<string>("1");

  return (
    <CardBody>
      <div className="notitications-bar">
        <Nav pills className="p-0 nav-primary" id="pills-tab" role="tablist">
          <NavItem className="p-0">
            <NavLink className={`${tabs === "1" ? "active" : ""}`} id="pills-aboutus-tab" href={Href} onClick={() => setTabs("1")}>All (3)</NavLink>
          </NavItem>
          <NavItem className="p-0">
            <NavLink className={`${tabs === "2" ? "active" : ""}`} id="pills-contactus-tab" href={Href} onClick={() => setTabs("2")}>Messages</NavLink>
          </NavItem>
          <NavItem className="p-0">
            <NavLink className={`${tabs === "3" ? "active" : ""}`} id="pills-blog-tab" href={Href} onClick={() => setTabs("3")}>Cart</NavLink>
          </NavItem>
        </Nav>
        <HeaderTabContent tabs={tabs} />
      </div>
    </CardBody>
  );
};
