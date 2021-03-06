import React, { Component } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { Layout } from "antd";

import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../component/left-nav";
import Header from "../../component/header";
import Home from "../home";
import Category from "../category";
import Role from "../role";

import Users from "../users";
import Product from "../product";
const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
  render() {
    const user = localStorage.getItem("user_key");
    // 如果内存中没有存储user ==>当前没登陆
    if (!user ) {
    
      //自动跳转到登陆
      return <Redirect to="/login" />;
    }
    return (
      <>
        <Layout style={{ height: "100%", width: "100%" }}>
          <Sider style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
      }}>
        {/* 设置固定侧边栏 */}
            <LeftNav />
          </Sider>
          <Layout style={{ marginLeft: 200 }}>
            <Header>Header</Header>
            <Content style={{ margin:20,backgroundColor: "white"}}>
              <Switch>
                <Route path="/home" component={Home} />
                <Route path="/category" component={Category} />
                <Route path="/product" component={Product} />
                <Route path="/role" component={Role} />
                <Route path="/user" component={Users} />
               
                <Redirect to="/user" />
              </Switch>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              
            </Footer>
          </Layout>
        </Layout>
        
      </>
    );
  }
}
