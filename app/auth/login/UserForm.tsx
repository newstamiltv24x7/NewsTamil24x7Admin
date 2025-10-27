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
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import imageOne from "@/public/assets/images/logo/logo.png";
import imageTwo from "@/public/assets/images/logo/logo_dark.png";
import MainLogo from "@/public/assets/images/logo/logo.png";
import { LoginApi } from "@/apiFunctions/ApiAction";
import { UserSocialApp } from "./UserSocialApp";
import Image from "next/image";

export const UserForm = () => {
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: false,
    password: false,
  });
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const isEmail = (email: String) => {
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email !== "" && email.match(emailFormat)) {
      return true;
    }
    return false;
  };

  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;

  const Login = async () => {
    const body = {
      email: email,
      password: password,
    };
    let results:any = await LoginApi(body);
    
    if (results?.appStatusCode === 4) {
      setLoader(false);
      toast.error(results?.error);
    } else if (results?.appStatusCode === 0) {
      setLoader(false);

      if(isChecked){
        localStorage.setItem("user_checked", "1");        
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_password", password);
      }else{
        localStorage.setItem("user_checked", "");
        localStorage.setItem("user_email", "");
        localStorage.setItem("user_password", "");
      }
      
     

      window.location.reload();
      let dummyArray:any =[];
      results?.payloadJson?.privileges.map((data:any) => 
        dummyArray.push(data?.role_privileage)
      )


     
      Cookies.set("riho_token", JSON.stringify(true));
      Cookies.set("_token", results?.payloadJson?.tokenAccess);
      Cookies.set("_token_expiry", results?.payloadJson?.tokenExpiry);
      Cookies.set("role_id", results?.payloadJson?.c_role_id);
      Cookies.set("user_id", results?.payloadJson?.user_id);
      Cookies.set("role_name", results?.payloadJson?.role);
      Cookies.set("user_name", results?.payloadJson?.user_name);
      Cookies.set("privileges", JSON.stringify(dummyArray));
      router.push(`/en/story`);
      toast.success("login successful");
    } else {
      setLoader(false);
      toast.error("Something Went wrong, Please try after some time");
    }
  };

  const formSubmitHandle = () => {
    if (!isEmail(email)) {
      setError({ ...error, email: true });
    } else if (!password.match(passRegex)) {
      setError({ ...error, password: true });
    } else {
      setLoader(true);
      Login();
    }
  };

  const handleEnter = (e:any) => {
    if (e.key === "Enter") {
      if (!isEmail(email)) {
        setError({ ...error, email: true });
      } else if (!password.match(passRegex)) {
        setError({ ...error, password: true });
      } else {
        setLoader(true);
        Login();
      }
    }
  };
useEffect(() => {
  const userEmail :any = localStorage.getItem("user_email")
  const userPassword :any = localStorage.getItem("user_password")
  const userChecked :any = localStorage.getItem("user_checked")

  if(userChecked === "1"){
  setEmail(userEmail);
  setPassword(userPassword);
  setIsChecked(true);
  }else{
  setEmail("");
  setPassword("");
  setIsChecked(false);
  }
}, [])



  return (
    <div
      style={loader ? { opacity: 0.3, pointerEvents: "none" } : { opacity: 1 }}
    >
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
          <h4>{SignInToAccount}</h4>
          <p>Enter your email & password to login</p>
          <FormGroup>
            <Label className="col-form-label">{EmailAddressLogIn}</Label>
            <Input
              autoFocus
              type="email"
              defaultValue={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError({ ...error, email: false, password: false });
              }}
              placeholder="eg: Test123@gmail.com"
            />
            {error.email && (
              <div style={{ color: "red", paddingTop: "4px" }}>
                Please enter valid email
              </div>
            )}
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label">{Password}</Label>
            <div className="position-relative">
              <Input
                type={show ? "text" : "password"}
                defaultValue={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError({ ...error, email: false, password: false });
                }}
                placeholder="eg: Test@123"
                onKeyDown={handleEnter}
              />
              <div className="show-hide" onClick={() => setShow(!show)}>
                <span className="show"> </span>
              </div>
            </div>
            {error.password && (
              <div style={{ color: "red", paddingTop: "4px" }}>
                Please enter atleast min 8 letters with one special character,
                one Uppercase and one Lowercase
              </div>
            )}
          </FormGroup>
          <FormGroup className="mb-0">
            <div className="checkbox p-0">
              <Input id="checkbox1" type="checkbox" 
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              />
              <Label className="text-muted" htmlFor="checkbox1">
                {RememberPassword}
              </Label>
            </div>
            <div className="text-end mt-3">
              <Button
                color="primary"
                block
                className="w-100"
                onClick={formSubmitHandle}
              >
                {SignIn}
              </Button>
            </div>
          </FormGroup>
          {/* <h6 className="text-muted mt-4">{OrSignInWith}</h6>
          <UserSocialApp /> */}
          <p
            className="mt-4 mb-0 text-center"
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => router.push("/auth/forgot_password")}
          >
            Forgot password ?
            {/* <span
              className="ms-2"
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => router.push("/auth/signup")}
            >
              {CreateAccount}
            </span> */}
          </p>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};
