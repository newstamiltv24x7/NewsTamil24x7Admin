import { ImagePath, Loading, SearchRiho } from "@/Constant";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { handleResponsiveToggle } from "@/Redux/Reducers/LayoutSlice";
import Link from "next/link";
import React from "react";
import { AlignCenter, X } from "react-feather";
import { Col, Form, FormGroup, Input } from "reactstrap";

export const MobileView = () => {
  const dispatch = useAppDispatch();
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);

  return (
    <>
      <Form className="form-inline search-full" method="get">
        <Col>
          <FormGroup className="w-100">
            <div className="Typeahead Typeahead--twitterUsers">
              <div className="u-posRelative">
                <Input className="demo-input Typeahead-input form-control-plaintext w-100" type="text" placeholder={SearchRiho} name="q" title="" autoFocus />
                <div className="spinner-border Typeahead-spinner" role="status">
                  <span className="sr-only">{Loading}</span>
                </div>
                <X className="close-search" />
              </div>
              <div className="Typeahead-menu"></div>
            </div>
          </FormGroup>
        </Col>
      </Form>
      <div className="header-logo-wrapper col-auto p-0">
        <div className="logo-wrapper">
          <Link href={`/${i18LangStatus}/story`}>
            <img className="img-fluid for-light" src={`${ImagePath}/logo/logo_dark.png`} alt="logo-light" />
            <img className="img-fluid for-dark" src={`${ImagePath}/logo/logo.png`} alt="logo-dark" />
          </Link>
        </div>
        <div className="toggle-sidebar">
          <AlignCenter className="status_toggle middle sidebar-toggle" onClick={()=>dispatch(handleResponsiveToggle())} />
        </div>
      </div>
    </>
  );
};
