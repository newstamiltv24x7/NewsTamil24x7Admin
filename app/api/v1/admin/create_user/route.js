import { NextResponse } from "next/server";
import { User } from "../../../../../models/userModel";
import connectMongoDB from "../../../../../libs/mongodb";
import { create_UUID,transporter } from "../../../../../helper/helper";
import slugify from "slugify";
const bcrypt = require("bcryptjs");

let sendResponse = {
  appStatusCode: "",
  message: "",
  payloadJson: [],
  error: "",
};

function  emailSend( mailData) {
  return new Promise(async (resolve, reject) => {
    await transporter.sendMail(mailData, function async(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });


  });
}

export async function POST(request) {
  const { first_name, last_name, email, role, c_role_id, c_user_img_url,c_about_user,Id,password
  } =
    await request.json();

  let passwordCheck = password ? password : "Password@123";


  


  try {
    await connectMongoDB();




    if (Id) {
      const userRoleId = await User.findOne({
        _id: Id,
      });

      if (userRoleId === null) {
        sendResponse["appStatusCode"] = 4;
        sendResponse["message"] = [];
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = "Please enter valid id!";
        return NextResponse.json(sendResponse, { status: 200 });
      } else {
        const hashPass = await bcrypt.hash(passwordCheck, 10);
        const user_name = first_name + " " + last_name;
        const slugString = user_name.replace(/[^\w\s]|_/g, "");
      const slug_name = slugify(slugString, 
        {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: false,
        locale: "vi",
        trim: true,
      }
      );

        const body = {
          first_name:first_name,
          last_name:last_name,
          user_name: user_name,
          c_about_user:c_about_user,
          slug_name:slug_name,
          email:email,
          role:role,
          c_role_id:c_role_id,
          c_user_img_url:c_user_img_url
        }
        if(password !== ""){
          body["password"] = hashPass
        }
        await User.findByIdAndUpdate(Id, body)
          .then(() => {
            if(password !== ""){      
              let mailData = {
                from: "no-reply@tamilnews24@gmail.com", // sender address
                to: `${email}`, // list of receivers
                subject: "News Tamil 24x7 password changes",
                text: "Login Credential",
                html: ``,
              };
              mailData["html"] = `
              <b>Hai ${user_name},</b>
              <h4>Your password has been changed by your Admin</h4>
              <br/>
              <h2>your latest password : <b>${password} </b></h2>
              <h5><b>Thank you, </b> <br /> News Tamil 24x7</h5>
            `;
              const result = emailSend(mailData)
              }

            sendResponse["appStatusCode"] = 0;
            sendResponse["message"] = "Updated Successfully!";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = [];
          })
          .catch((err) => {
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "Invalid Id";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = err;
          });
        return NextResponse.json(sendResponse, { status: 200 });
      }
    } else {
      
    const checkUserEmail = await User.findOne({
      email: email,
    });

    if (first_name === "") {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "First Name is required";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "";
    }
   
    else if (email === "") {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "Email id is required";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "";
    } 
    else if (c_role_id === "") {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "Role is required";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "";
    }
    else if (password === "") {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = "Password is required";
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "";
    }
    else if (checkUserEmail) {
      sendResponse["appStatusCode"] = 4;
      sendResponse["message"] = [];
      sendResponse["payloadJson"] = [];
      sendResponse["error"] = "Please check. user email already exist";
    } else {
      const hashPass = await bcrypt.hash(passwordCheck, 10);
      const user_name = first_name + " " + last_name;

      const slugString = user_name.replace(/[^\w\s]|_/g, "");
      const slug_name = slugify(slugString, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: false,
        locale: "vi",
        trim: true,
      });

      

      if (role !== "super-admin" || role === undefined) {
        if (role === undefined) {
          
          let data = {
            role: "super-admin",
          };
          const resulData = await User.find(data);
          const userdata = new User({
            user_id: create_UUID(),
            first_name,
            last_name,
            user_name,
            email,
            role,
            slug_name,
            c_about_user,
            c_role_id,
            c_user_img_url,
            password: hashPass,
          });

          if (resulData.length === 0 || resulData === null) {
            await userdata.save().then((result) => {
              sendResponse["appStatusCode"] = 0;
              sendResponse["message"] = "User added Successfully";
              sendResponse["payloadJson"] = result;
              sendResponse["error"] = [];
            });
          } else {
            
            if (resulData[0].role === "super-admin") {
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "This access not allowed";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            } else {
              
              sendResponse["appStatusCode"] = 4;
              sendResponse["message"] = "other role not allowed";
              sendResponse["payloadJson"] = [];
              sendResponse["error"] = [];
            }
          }
        } else {


          
          
          

          if(first_name === ""){
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "Please check first name";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = [];
          }
          else if(email === ""){
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "Please check email";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = [];
          }else if(password === ""){
            sendResponse["appStatusCode"] = 4;
            sendResponse["message"] = "Please check password";
            sendResponse["payloadJson"] = [];
            sendResponse["error"] = [];
          }else{
            const userdata = new User({
              user_id: create_UUID(),
              first_name,
              last_name,
              user_name,
              slug_name,
              email,
              c_about_user,
              role,
              c_role_id: c_role_id,
              c_user_img_url,
              password: hashPass,
            });
  
  
  
            await userdata.save().then((result) => {
              if (result) {
                sendResponse["appStatusCode"] = 0;
                sendResponse["message"] = "User added Successfully";
                sendResponse["payloadJson"] = [];
                sendResponse["error"] = [];
              } else {
                sendResponse["appStatusCode"] = 4;
                sendResponse["message"] = "User Not added";
                sendResponse["payloadJson"] = [];
                sendResponse["error"] = error;
              }
            });
          }


          
          
        }
      } else if (role === "super-admin") {
        sendResponse["appStatusCode"] = 0;
        sendResponse["message"] = "please check your role";
        sendResponse["payloadJson"] = [];
        sendResponse["error"] = [];
      }
    }
    return NextResponse.json(sendResponse, { status: 200 });
    }



























  } catch (err) {
    sendResponse["appStatusCode"] = 4;
    sendResponse["message"] = err;
    sendResponse["payloadJson"] = [];
    sendResponse["error"] = "Something went wrong!!";
    return NextResponse.json(sendResponse, { status: 400 });
  }
}
