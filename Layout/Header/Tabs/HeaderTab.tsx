import SVG from "@/CommonComponent/SVG";
import { CheckAll, Href, Notifications } from "@/Constant";
import Link from "next/link";
import { Badge, Button, Card, CardFooter, CardHeader } from "reactstrap";
import { HeaderTabCardBody } from "./HeaderTabCardBody";

export const HeaderTab = () => {
  return (
    <li className="onhover-dropdown notification-down">
      <div className="notification-box">
        <SVG iconId="notification-header" />
        <Badge pill color="secondary">4</Badge>
      </div>
      <div className="onhover-show-div notification-dropdown">
        <Card className="mb-0">
          <CardHeader>
            <div className="common-space">
              <h4 className="text-start f-w-500">{Notifications}</h4>
              <div><span>4 New </span></div>
            </div>
          </CardHeader>
          <HeaderTabCardBody />
          <CardFooter>
            <div className="text-center">
              <Link className="f-w-700" href={Href}>
                <Button color="primary">{CheckAll}</Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </li>
  );
};
