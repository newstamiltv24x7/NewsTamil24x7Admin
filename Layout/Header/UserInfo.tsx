import Breadcrumbs from "@/CommonComponent/Breadcrumbs";
import { Col } from "reactstrap";

export const UserInfo = (props: any) => {
  const { breadCrumb } = props;
  return (
    <Col xl="5" lg="4" md="4" sm="3" className="left-header p-0">
      <div>
        <a className="toggle-sidebar" href="#">
          <i className="iconly-Category"> </i>
        </a>
        {/* <div className="d-flex align-items-center gap-2 ">
          <h4 className="f-w-600">Welcome Admin</h4>
          <img className="mt-0" src={`${ImagePath}/hand.gif`} alt="hand-gif" />
        </div> */}
        <Breadcrumbs
          pageTitle={breadCrumb?.title}
          parent={breadCrumb?.parent}
        />
      </div>
      {/* <div className="welcome-content d-xl-block d-none">
        <Col xs="12">
          <span className="text-truncate">
            Here’s what’s happening with your store today.{" "}
          </span>
        </Col>
      </div> */}
    </Col>
  );
};
