import Link from "next/link";
import React from "react";
import { BreadcrumbItem, Col, Row, Container, Breadcrumb } from "reactstrap";
import SVG from "../SVG";
import { useAppSelector } from "@/Redux/Hooks";
import { GoHome } from "react-icons/go";

interface BreadcrumbsType {
  parent: any;
  pageTitle: any;
}

const Breadcrumbs: React.FC<BreadcrumbsType> = ({ pageTitle, parent }) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);

  return (
    <Container fluid>
      <div className="page-title">
        <Row>
          {/* <Col xs="6">
            <h4>{pageTitle}</h4>
          </Col> */}
          <Col xs="6">
            <Breadcrumb className="common-breadcrumbs-header">
              <BreadcrumbItem>
                <Link href={`/${i18LangStatus}/story`}>
                  {/* <SVG iconId="stroke-home" /> */}
                  <GoHome />
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>{parent}</BreadcrumbItem>
              <BreadcrumbItem active>{pageTitle}</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Breadcrumbs;
