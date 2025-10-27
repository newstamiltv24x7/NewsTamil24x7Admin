import { Href, ImagePath } from "@/Constant";
import { MessageData } from "@/Data/Layout";
import Link from "next/link";
import { TabPane } from "reactstrap";

export const UpdateTab = () => {
  return (
    <TabPane tabId="2" id="pills-contactus">
      <div className="notification-card">
        <ul>
          {MessageData.map((data, i) => (
            <li className="notification d-flex w-100 justify-content-between align-items-center" key={i}>
              <div className="d-flex w-100 notification-data justify-content-center align-items-center gap-2">
                <div className="user-alerts flex-shrink-0">
                  <img className="rounded-circle img-fluid img-40" src={`${ImagePath}/dashboard/user/${data.image}`} alt="user" />
                </div>
                <div className="flex-grow-1">
                  <div className="common-space user-id w-100">
                    <div className="common-space w-100">
                      <Link className="f-w-500 f-12" href={Href}>{data.name}</Link>
                    </div>
                  </div>
                  <div className="text-start">
                    <span className="f-w-500 f-light f-12">{data.detail}</span>
                  </div>
                </div>
              </div>
              <span className="f-light f-w-500 f-12">{data.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </TabPane>
  );
};
