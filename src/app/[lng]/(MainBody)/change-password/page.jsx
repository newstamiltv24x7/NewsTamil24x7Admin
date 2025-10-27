"use client";
import { useAppSelector } from "@/Redux/Hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

import { userChangePassword } from "@/apiFunctions/ApiAction";
import { Container } from "@mui/material";
import Cookies from "js-cookie";

const page = () => {
  const router = useRouter();
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [inputs, setInputs] = useState({
    oldPassword: "",
    newPassword: "",
    cnfPassword: "",
  });
  const [error, setError] = useState([]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    setError([]);
  };

  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;

  const formSubmitHandle = () => {
    // // window.location.reload();
    // if (!password.match(passRegex)) {
    //   setError({ ...error, password: true });
    // } else if (password !== cfpassword) {
    //   setError({ ...error, cfpassword: true });
    // } else {
    //   // toast.success("Password Changed Successfully");
    //   // setTimeout(() => {
    //   //   router.push("/auth/login");
    //   // }, 3000);
    //   changePasswordFn();
    // }

    var arr = [];

    Object.entries(inputs)?.map(([key, value]) => {
      if (key === "oldPassword") {
        if (!inputs[key].match(passRegex)) {
          arr.push("old");
        }
      } else if (key === "newPassword") {
        if (!inputs[key].match(passRegex)) {
          arr.push("new");
        }
      } else if (key === "cnfPassword") {
        if (!inputs[key].match(passRegex)) {
          arr.push("cnf");
        }
      }
    });
    setError(arr);
    if (arr.length === 0) {
      ChangePasswordFn();
    }
  };

  const LogOutUser = () => {
    Cookies.remove("riho_token");
    Cookies.remove("_token");
    Cookies.remove("_token_expiry");
    Cookies.remove("privileges");
    Cookies.remove("role_id");
    Cookies.remove("role_name");
    Cookies.remove("user_name");
    router.push("/auth/login");
  };

  const ChangePasswordFn = async () => {
    try {
      const body = {
        c_new_pass: inputs.newPassword,
        c_confirm_pass: inputs?.cnfPassword,
        c_old_pass: inputs.oldPassword,
      };
      let results = await userChangePassword(body);
      if (results.appStatusCode !== 0) {
        toast.error(results?.error);
      } else {
        toast.success(results?.message);

        setTimeout(() => {
          LogOutUser();
        }, 3000);

        
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <div>
        <div className="login-main" style={{ padding: "12px 10%" }}>
          <Form
            className="theme-form mt-4"
            style={{
              border: "1px solid #c1c1c1",
              padding: 12,
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
          >
            <h4 style={{ textAlign: "center" }}>Change Password </h4>
            <FormGroup>
              <Label className="col-form-label">Old Password</Label>
              <Input
              autoComplete="off"
                type="text"
                name="oldPassword"
                value={inputs?.oldPassword}
                onChange={handleChange}
                placeholder="eg: Test@123"
              />
              {error.includes("old") && (
                <p style={{ color: "red", paddingTop: "4px" }} className="mb-0">
                  Please enter valid old password
                </p>
              )}
              <Label className="col-form-label">New Password</Label>
              <Input
              autoComplete="off"
                type="text"
                name={"newPassword"}
                value={inputs?.newPassword}
                onChange={handleChange}
                placeholder="eg: Test@1234"
              />
              {error.includes("new") && (
                <p style={{ color: "red", paddingTop: "4px" }} className="mb-0">
                  Please enter atleast min 8 letters with one special character,
                  one Uppercase and one Lowercase
                </p>
              )}
              <Label className="col-form-label mt-3">Conform Password</Label>
              <Input
                autoComplete="off"
                type="text"
                name={"cnfPassword"}
                value={inputs?.cnfPassword}
                onChange={handleChange}
                placeholder="eg: Test@1234"
              />
              {error.includes("cnf") && (
                <p style={{ color: "red", paddingTop: "4px" }} className="mb-0">
                  You've entered password doesn't match with your new password
                </p>
              )}
            </FormGroup>
            <FormGroup className="mb-0">
              <div className="mt-3 mb-0" style={{ textAlign: "center" }}>
                <Button
                  color="primary"
                  // block
                  // className="w-100"
                  onClick={formSubmitHandle}
                >
                  Change Password
                </Button>
              </div>
            </FormGroup>
          </Form>
        </div>
        <ToastContainer />
      </div>
    </Container>
  );
};

export default page;
