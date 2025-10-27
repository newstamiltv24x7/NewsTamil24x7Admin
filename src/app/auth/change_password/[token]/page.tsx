
import { Col, Container, Row } from "reactstrap";
import { ChangePasswordForm } from "./changePasswordForm";

const ForgotPassword = () => {
  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col xs="12" className="p-0">
          <div className="login-card login-dark">
            <ChangePasswordForm />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
