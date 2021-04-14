import React, { Component } from "react";
// import { PageHeader } from "antd";
import "./index.less";
import { formateDate } from "../../utils/dataUtils";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import menuList from "../../config/menuConfig";
// import { set } from "store";
import { withRouter } from "react-router-dom";
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LinkButton from '../link-button'
const { confirm } = Modal;
class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()),
    
  };
  getTime = () => {
    this.a=setInterval(() => {
      this.setState({ currentTime: formateDate(Date.now()) });
    }, 60* 1000);
  };
  
  //退出登陆
  logout=()=>{
    //显示确认框
    const {history} = this.props
    // console.log(history)
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: 'Do you sure login out?',
      
      onOk() {
        console.log(this);
        
        storageUtils.deleteUser()
        localStorage.clear()
        memoryUtils.user ={}
        history.replace('/login')
      },
      onCancel() {
        console.log('cancel');
      },
    });
  }
  getTitle = () => {
    const path = this.props.location.pathname;
    let title;
    menuList.forEach((item) => {
      if (item.key === path) {
        // console.log(item);
        title = item.title;
      } else if (item.children) {
        const cItem = item.children.find((cItem) => path.indexOf(cItem.key)===0);
        if (cItem) {
//去除titke
          title = cItem.title;
        }
      }
    });
    // console.log(title)
    return title;
  };
  /* 第一次render后立即执行 */
  componentDidMount() {
    this.getTime();
    
    
  }
  componentWillUnmount(){
    clearInterval(this.a)
  }
  render() {
    const { currentTime} = this.state;
    const user = memoryUtils.user.name;
    const user1 = storageUtils.getUser.name;
    console.log("user1=>" + user1)
    //显示当前的title
    const title=this.getTitle();
    // console.log('title',title)
    return (
      <div className="header">
        <div className="header-top">
          <span>Welcome {user} </span>
          <LinkButton onClick={this.logout}>Logout</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">
            <span>{title}</span>
          </div>
          <div className="header-bottom-right">
            <span>{currentTime} </span>
            
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
