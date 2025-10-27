import { TabPane } from "reactstrap";
import { AllCartData } from "./AllCartData";
import { UserNotification } from "@/Data/Layout";
import { Href, ImagePath } from "@/Constant";
import Link from "next/link";
import SVG from "@/CommonComponent/SVG";

export const AllTabPane = () => {
  return (
    <TabPane tabId="1" id="pills-aboutus">
      <div className="user-message">
        <AllCartData />
        <ul>
          {UserNotification.map((data, i) => (
            <li key={i}>
              <div className="user-alerts">
                <img className="user-image rounded-circle img-fluid me-2" src={`${ImagePath}/dashboard/user/${data.image}`} alt="user" />
                <div className="user-name">
                  <div>
                    <h6>
                      <Link className="f-w-500 f-14" href={Href}>{data.name}</Link>
                    </h6>
                    <span className="f-light f-w-500 f-12">{data.detail}</span>
                  </div>
                  <div>
                    <SVG iconId="more-vertical" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </TabPane>
  );
};
