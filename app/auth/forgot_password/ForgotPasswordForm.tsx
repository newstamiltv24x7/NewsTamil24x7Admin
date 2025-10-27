import {
  CreateAccount,
  DontHaveAccount,
  EmailAddressLogIn,
  Href,
  ImagePath,
  OrSignInWith,
  Password,
  RememberPassword,
  SignIn,
  SignInToAccount,
} from "@/Constant";
import { useAppSelector } from "@/Redux/Hooks";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Spinner,
} from "reactstrap";
import imageOne from "@/public/assets/images/logo/logo.png";
import imageTwo from "@/public/assets/images/logo/logo_dark.png";
import MainLogo from "@/public/assets/images/logo/logo.png";
import {
  checkMailApi,
  forgotPasswordApi,
} from "../../../apiFunctions/ApiAction";
import Image from "next/image";

export const ForgotPasswordForm = () => {
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [toastFlag, setToastFlag] = useState(false);
  const [email, setEmail] = useState("");
  const [statusCode, setstatusCode] = useState();
  const [loader, setLoader] = useState(false);
  const [successFlag, setSuccessFlag] = useState(false);
  const [checkFlag, setCheckFlag] = useState(false);
  const [error, setError] = useState({
    email: false,
    password: false,
  });
  const router = useRouter();

  const isEmail = (email: String) => {
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email !== "" && email.match(emailFormat)) {
      return true;
    }
    return false;
  };

  const formSubmitHandle = () => {
    // window.location.reload();
    if (!isEmail(email)) {
      setError({ ...error, email: true });
    } else {
      setLoader(true);
      forgetPasswordFn();
    }
  };

  const forgetPasswordFn = async () => {
    const body = {
      email: email,
      // c_redirect: "http://localhost:3000/auth/change_password",
      c_redirect: `${window.location.origin}/auth/change_password`,
    };
    let results = await forgotPasswordApi(body);
    if (results.appStatusCode !== 0) {
      setLoader(false);
      toast.error("Please check your internet connection");
    } else {
      setLoader(false);
      setstatusCode(results.appStatusCode);
      toast.success(results?.message);
      setSuccessFlag(true);
    }
  };

  const checkMailFn = async () => {
    const body = {
      email: email,
    };
    let results = await checkMailApi(body);
    if (results?.appStatusCode !== 4) {
      setCheckFlag(false);
      toast.error("This email is not registered with us");
      setToastFlag(true);
      setstatusCode(results?.appStatusCode);
    } else {
      setCheckFlag(false);
      setstatusCode(results?.appStatusCode);
    }
  };

  const handleBlur = () => {
    if (!error?.email && isEmail(email) && !toastFlag) {
      setCheckFlag(true);
      checkMailFn();
    }
  };

  return (
    <div className={`${loader ? "loader-class" : "completed-class"}`}>
      <div>
        <Link className="logo" href={`/${i18LangStatus}/story`}>
          {/* <img className="img-fluid for-dark" src={imageOne.src} alt="login page" />
            <img className="img-fluid for-light" src={imageTwo.src} alt="login page" /> */}
          <Image
            className="img-fluid"
            src={MainLogo}
            alt=""
            width={162}
            height={60}
          />
        </Link>
      </div>
      <div className="login-main">
        <Form className="theme-form">
          <h4>Forgot Password ?</h4>
          <p>Reset Your Password Here</p>
          <FormGroup>
            <Label className="col-form-label">{EmailAddressLogIn}</Label>
            <InputGroup>
              <Input
                type="email"
                defaultValue={email}
                disabled={successFlag}
                onBlur={() => handleBlur()}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError({ ...error, email: false, password: false });
                  setToastFlag(false);
                }}
                placeholder="eg: Test123@gmail.com"
              />
              {checkFlag && (
                <InputGroupText>
                  <Spinner color="dark">Loading...</Spinner>
                </InputGroupText>
              )}

              {error.email && (
                <div style={{ color: "red", paddingTop: "4px" }}>
                  Please enter valid email
                </div>
              )}
            </InputGroup>
          </FormGroup>
          <FormGroup className="mb-0">
            <div className="text-end mt-3">
              <Button
                color="primary"
                block
                className="w-100"
                onClick={formSubmitHandle}
                disabled={statusCode !== 4}
              >
                Send Link
              </Button>
            </div>
            <p
              className="mt-4 mb-0 text-center"
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => router.push("/auth/login")}
            >
              Back to Login
            </p>
          </FormGroup>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};
