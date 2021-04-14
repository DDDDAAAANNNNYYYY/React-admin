import React, { Component } from "react";
import logo from "../../assets/image/logo.png";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {Redirect} from 'react-router-dom'
import "./index.less";
import { reqCheckLogin, reqLogin } from "../../api/index.js";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";

export default class Login extends Component {
  onFinish = async (values) => {
    //console.log("Received values of form: ", values);
    //
    // console.log('this----',this)
    const { username, password } = values;
    console.log("username=>" + username)
    console.log("password=>" + password)
    try {
      const response = await reqLogin(username, password);
      // .then(response=>{
      //   
      // }).catch(error=>{
      //   
      // );
      console.log("请求成功", response);

      const token = response; //{state:0,data:user} {state:1,msg:'xxxx'}
     
      const verifyResponse = await reqCheckLogin(token)
    
      const result = verifyResponse;
      console.log(result)
      if (result.name === "admin") {
        
        message.success("login sucessful");
      
        // const user = u;
        // console.log(u)
        const user=result
        
       
       
        memoryUtils.user = user;
        storageUtils.saveUser(user);
        // console.log(this);
        this.props.history.push("/user");
      } else {
        // 
        message.error("wrong username/password");
      }
    } catch (error) {
      //console.log("", error);
    }
  };
  onFinishFailed = (values, errorFields, outOfDate) => {
    //console.log("校验失败");
    values.errorFields.map((x) => {
      return //console.log(x.errors);
    });
    // //console.log('value------',values)
  };
  validatePwd = (rule, value, callback) => {
    // //console.log(value)
    if (!value) {
      callback("please input password");
    } else if (value.length < 4) {
      callback("the length of password must be larger than 4");
    } else if (value.length > 12) {
      callback("the length of password must be smaller than 12");
    } else {
      callback(); //验证通过
    }
  };
  render() {
    //
    const user = memoryUtils.user;
    if (user&&user._id) {
      
      
      return <Redirect to="/user" />;
    }
    return (
      <div className="login">
        <header className="login-header">
         
          <h1>Smart.TimeSheet</h1>
        </header>
        <section className="login-content">
          <h2>User Login</h2>

          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              name="username"
              initialValue="admin"
              rules={[
                {
                  required: true,
                  message: "Please enter your usrname!",
                },
                {
                  min: 3,
                  message: "min length is 3",
                },
                {
                  max: 15,
                  message: "max length is 15",
                },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "must be letters or number",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              initialValue="admin"
              rules={[
                {
                  required: true,
                  message: "please input password!",
                },
                {
                  validator: this.validatePwd,
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="password"
              />
            </Form.Item>
            {/* <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item> */}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button" 
                style={{width:"100%" }}             
              >
                Login
              </Button>
              {/* Or <a href="">register now!</a> */}
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
