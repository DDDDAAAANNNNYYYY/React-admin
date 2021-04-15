import React, { Component } from "react";
import { Button, Card, Table, Modal, message } from "antd";
import { PAGE_SIZE } from "../../utils/constant";
import { formateDate } from "../../utils/dataUtils";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import LinkButton from "../../component/link-button";
import { reqDelUser, reqUsers} from "../../api";
import UserForm from "./user-form";
export default class Users extends Component {
  state = {
    users: [], 
    showStatus: 0,
    roles: [],
    user: {},
    visible: 2,
    more: true,
  };
  constructor(props) {
    super(props);
    this.us = React.createRef();
  }
  initColumns = () => {
    this.columns = [
      {
        title: "Week",
        dataIndex: "weekEnd",
      },
      {
        title: "Hours",
        dataIndex: "hours",
      },
      {
        title: "Status",
        dataIndex: "submissionStatus",
      },
      {
        title: "Approval",
        dataIndex: "approvalStatus",
        // render: (create_time) => formateDate(create_time),
      },
      {
        title: "Comments",
        dataIndex: "comments",
        
      },
      {
        title: "Options",
        render: (user,text, index) => (
          
          
          <span>
            {/* <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton> */}
            {/* <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton> */}
            {/* <LinkButton onClick={() => this._handleButtonClick(user)}>go</LinkButton> */}
            
            <LinkButton onClick={()=>{this.props.history.push('/product', {user});
              storageUtils.saveIndex(index);
              alert(index);
            }}>{user.option}</LinkButton>
          </span>
        ),
      },
    ];
  };
  
  

  /* 删除指定用户 */

  // deleteUser = (user) => {
  //   Modal.confirm({
  //     title: `确认删除${user.username}吗?`,

  //     onOk: async () => {
  //       const result = await reqDelUser(user._id);
  //       if (result.status === 0) {
  //         message.success("删除用户成功!");
  //         this.getUsers();
  //       } else {
  //         message.error("删除用户失败!");
  //       }
  //     },
  //   });
  // };
  
  getUsers = async () => {
    const name = memoryUtils.user.name;
    const result = await reqUsers(name);
    
    if (true) {
      const  users  = result;
      console.log(result)
      console.log(users)
      storageUtils.saveList(result)
      // this.initRoles(roles);
      this.setState({ users});
    } else {
      message.error("failsed");
    }
  };
  // addOrUpdateuser = async () => {
    
  //   //收集数据
  //   let user = this.us.current.addOrUpdateUser();
  //   user.create_time = Date.now();
  //   if (this.state.user._id) {
  //     user._id = this.state.user._id;
  //   }
  //   //   2.提交添加的请求
  //   const result = await reqAddOrUpdateUser(user);
  //   // 3.更新列表显示
  //   if (result.status === 0) {
  //     message.success(`${this.state.user._id?'修改':'添加'}角色成功`);
  //     this.getUsers();
  //     this.setState({ showStatus: 0 });
  //   } else {
  //     message.error(`${this.state.user._id?'修改':'添加'}角色失败`);
  //   }
  //   // //console.log(user);
  // };
  // showUpdate = (user) => {
  //   this.state.user = user;
  //   this.setState({ showStatus: 1 });
  // };
  UNSAFE_componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getUsers();
  }
  // handleCancel = () => {
  //   alert("here")
  //   this.setState({ showStatus: 0 });
  // };
  render() {
    const { users, showStatus, roles } = this.state;
    ////console.log(users);
    // const title = (
    //   <Button
    //     type="primary"
    //     onClick={() => {
    //       this.setState({ showStatus: 1, user: {} });
    //     }}
    //   >
    //     创建用户
    //   </Button>
    // );
    return (
      
      <Card >
        <Table
          // rowKey="_id"
          // pagination={{
          //   pageSize: 1,
          //   // , total: 50
          // }}
          pagination={ false }
          dataSource={users.slice(0,this.state.visible)}
          columns={this.columns}
          bordered
          
        />
        {/* {users.slice(0,1).map((x, i) => {
        return <div key={i} className="box">
          
          <div className="name"><span>{x.username}</span> 
          <span>                  </span>
          <span>{x.totalHours}</span></div>  
          <div className="name"> </div>     
        </div>
      })} */}
      <div style={{ display: this.state.more ? "block" : "none"}}>
          <Button onClick={()=>{this.setState({visible:this.state.visible+2,
          more: !this.state.more
          })}} type="button" className="load-more">Load more</Button>
          </div>
          <div style={{ display: this.state.more ? "none" : "block"}}>
          <Button onClick={()=>{this.setState({visible:2,
          more: !this.state.more
          })}} type="button" className="load-more">Load less</Button>
          </div>

        {/* <Modal
          title={this.state.user._id ? "修改用户" : "添加用户"}
          visible={showStatus === 1}
          onOk={this.addOrUpdateuser}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <UserForm roles={roles} ref={this.us} user={this.state.user} />
         
        </Modal> */}
      </Card>
    );
  }
}
