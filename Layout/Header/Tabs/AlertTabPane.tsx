import { Href, ImagePath } from "@/Constant";
import { CartData } from "@/Data/Layout";
import Link from "next/link";
import { X } from "react-feather";
import { Button, Input, InputGroup, Media, TabPane } from "reactstrap";

export const AlertTabPane = () => {
  return (
    <TabPane tabId="3" id="pills-blog">
      <div className="cart-dropdown mt-4">
        <ul className="cart-box-header">
          {CartData.map((data, i) => (
            <li className="pr-0 pl-0 pb-3 mx-0" key={i}>
              <Media>
                <img className="img-fluid b-r-5 me-3 img-60" src={`${ImagePath}/other-images/${data.image}`} alt="cart" />
                <Media body>
                  <Link className="f-light f-w-500" href={Href}>{data.title}</Link>
                  <div className="qty-box">
                    <InputGroup>
                      <span className="input-group-prepend">
                        <Button className="quantity-left-minus"> - </Button>
                      </span>
                      <Input className="input-number" type="text" name="quantity" defaultValue={1} />
                      <span className="input-group-prepend">
                        <Button className="quantity-right-plus">+</Button>
                      </span>
                    </InputGroup>
                  </div>
                  <h6 className="font-primary">${data.amount}</h6>
                </Media>
                <div className="close-circle">
                  <Link className="bg-danger" href={Href}><X /></Link>
                </div>
              </Media>
            </li>
          ))}
          <li className="total">
            <Link href={Href}>
              <h6 className="mb-0">Order Total : <span className="f-right">$1195.00</span></h6>
            </Link>
          </li>
        </ul>
      </div>
    </TabPane>
  );
};
