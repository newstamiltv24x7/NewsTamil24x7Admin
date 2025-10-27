"use client";
import { useAppSelector } from "@/Redux/Hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
// import MainLogo from "../../../../../public/assets/images/logo/news-logo.webp";
import MainLogo from "@/public/assets/images/logo/logo.png";
import Image from "next/image";
import { changePasswordApi } from "@/apiFunctions/ApiAction";

export const ChangePasswordForm = () => {
  const router = useRouter();
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [toastFlag, setToastFlag] = useState(false);
  const [password, setPassword] = useState("");
  const [cfpassword, setCfpassword] = useState("");
  const [error, setError] = useState({
    password: false,
    cfpassword: false,
  });

  const tokenPath = window.location.href.split("?").at(1);

  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;

  const formSubmitHandle = () => {
    // window.location.reload();
    if (!password.match(passRegex)) {
      setError({ ...error, password: true });
    } else if (password !== cfpassword) {
      setError({ ...error, cfpassword: true });
    } else {
      // toast.success("Password Changed Successfully");
      // setTimeout(() => {
      //   router.push("/auth/login");
      // }, 3000);
      changePasswordFn();
    }
  };

  const changePasswordFn = async () => {
    const body = {
      c_new_pass: password,
      c_confirm_pass: cfpassword,
    };
    let results = await changePasswordApi(body, tokenPath);

    if(results){
      toast.success("Password Changed Successfully");
            setTimeout(() => {
        router.push("/auth/login");
      }, 3000);

    }else{
      toast.error("Password not changed");
    }
   

    
  };

  return (
    <div>
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
          <h4>Change Password </h4>
          <p></p>
          <FormGroup>
            <Label className="col-form-label">New Password</Label>
            <Input
              type="email"
              defaultValue={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError({ ...error, password: false, cfpassword: false });
                setToastFlag(false);
              }}
              placeholder="eg: Test123"
            />
            {error.password && (
              <div style={{ color: "red", paddingTop: "4px" }}>
                Please enter atleast min 8 letters with one special character,
                one Uppercase and one Lowercase
              </div>
            )}
            <Label className="col-form-label mt-3">Conform Password</Label>
            <Input
              type="email"
              defaultValue={cfpassword}
              onChange={(event) => {
                setCfpassword(event.target.value);
                setError({ ...error, password: false, cfpassword: false });
                setToastFlag(false);
              }}
              placeholder="eg: Test123"
            />
            {error.cfpassword && (
              <div style={{ color: "red", paddingTop: "4px" }}>
                Password and Conform password should be the same
              </div>
            )}
          </FormGroup>
          <FormGroup className="mb-0">
            <div className="text-end mt-3">
              <Button
                color="primary"
                block
                className="w-100"
                onClick={formSubmitHandle}
              >
                Change Password
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
