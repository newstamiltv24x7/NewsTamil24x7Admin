import { Col } from "reactstrap";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderTab } from "./Tabs/HeaderTab";
import { ProfileSection } from "./ProfileSection";
import { ResponsiveSearch } from "./ResponsiveSearch";
import { DarkMood } from "./DarkMood";
import Languages from "./Languages";
import MaximizeScreen from "./Maximize";
import { BookMark } from "./BookMark";

export const Profile = () => {
  return (
    <Col xl="7" lg="8" md="7" xs="8" className="nav-right pull-right right-header p-0 ms-auto">
      <ul className="nav-menus">
        {/* <HeaderSearch /> */}
        <ResponsiveSearch />
        {/* <Languages /> */}
        <MaximizeScreen />
        {/* <BookMark /> */}
        <DarkMood />
        {/* <HeaderTab /> */}
        <ProfileSection />
      </ul>
    </Col>
  );
};
