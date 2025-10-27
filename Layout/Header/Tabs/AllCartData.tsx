import { Href, ImagePath } from "@/Constant";
import Link from "next/link";
import { X } from "react-feather";
import { Button, Input, InputGroup, Media } from "reactstrap";

export const AllCartData = () => {
  return (
    <div className="cart-dropdown notification-all">
      <ul>
        <li className="pr-0 pl-0 pb-3 pt-3 mx-0">
          <Media>
            <img className="img-fluid b-r-5 me-3 img-60" src={`${ImagePath}/other-images/receiver-img.jpg`} alt="receiver" />
            <div className="media-body">
              <Link className="f-light f-w-500" href={Href}>Men Blue T-Shirt</Link>
              <div className="qty-box">
                <InputGroup>
                  <span className="input-group-prepend">
                    <Button className="quantity-left-minus"> - </Button>
                  </span>
                  <Input className="input-number" type="text" name="quantity" defaultValue={1} />
                  <span className="input-group-prepend">
                    <Button className="quantity-right-plus"> + </Button>
                  </span>
                </InputGroup>
              </div>
              <h6 className="font-primary">$695.00</h6>
            </div>
            <div className="close-circle">
              <Link className="bg-danger" href={Href}><X /></Link>
            </div>
          </Media>
        </li>
      </ul>
    </div>
  );
};
