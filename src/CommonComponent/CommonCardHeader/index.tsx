import { useAppSelector } from "@/Redux/Hooks";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import { CardHeader, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

interface CommonCardHeaderProp {
  title: string;
  span?: SpanType[];
  icon?:JSX.Element;
  tagClass?: string;
  headClass?: string;
  tag?: string;
  dropDown?:boolean;
  todayDropdown?:boolean;
  dropClass?:string;
  employDropDown?:boolean;
  path?:string;
}

interface SpanType {
  text?: string;
  code?: string;
  mark?: string;
}

const CommonCardHeader: React.FC<CommonCardHeaderProp> = ({ title, span, icon, tagClass, headClass, tag, dropDown, todayDropdown, dropClass, employDropDown, path }) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <CardHeader className={headClass ? headClass : ""}>
      <h4 className={tagClass ? tagClass : ""}>{icon && icon}{title}</h4>
      {tag && <Link href={`/${i18LangStatus}/${path}`}>{tag}</Link>}
      {span && (
        <p className="f-m-light mt-1">
          {span.map((data, index) => (<Fragment key={index}>{data?.text} {data.code && <code>{data.code}</code>} {data.mark && <mark>{data.mark}</mark>}</Fragment>))}
        </p>
      )}
      {dropDown && (
        <div className="sales-chart-dropdown-select">
          <div className="card-header-right-icon">
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle caret color="transparent" className={`dropdown-toggle border-light ${dropClass ? dropClass : ""}`}>{todayDropdown ? "Today" : `${employDropDown ? "Employee" : "This Week"}` }</DropdownToggle>
              <DropdownMenu end>
                <DropdownItem>{todayDropdown ? "Last Month" : `${employDropDown ? "All" : "This Day"}` }</DropdownItem>
                <DropdownItem>{todayDropdown ? "Last Week" : `${employDropDown ? "Employee" : "This Month"}` }</DropdownItem>
                <DropdownItem>{todayDropdown ? "Last Day" : `${employDropDown ? "Client" : "This Year"}` }</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      )}
    </CardHeader>
  );
};

export default CommonCardHeader;
