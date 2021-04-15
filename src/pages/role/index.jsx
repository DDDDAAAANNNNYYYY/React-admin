import React, { Component, } from "react";
// import { Card, Button, Table, Modal, message } from "antd";
import { PAGE_SIZE } from "../../utils/constant";
import { reqContact, reqUserInfo} from "../../api";
import AddForm from "./add-form.jsx";
import SetTree from "./setTree";
import { get } from "store";
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dataUtils'
import storageUtils from "../../utils/storageUtils";
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';

import { Form, Input, InputNumber, Button } from 'antd';
import axios from "axios";

/* 角色路由 */
// export default class Role extends Component {
//   state = {
//     loading: false,
//     roles: [],
//     role: {},
//     showStatus: 0,
//   };
//   constructor(props){
//       super(props)
//       this.auth= React.createRef()
//   }
//   getRoles = async () => {
//     const result = await reqRoleList();
//     if (result.status === 0) {
//       const roles = result.data;
//       this.setState({
//         roles,
//       });
//     }
//   };
//   initColumn = () => {
//     this.columns = [
//       {
//         title: "角色名称",
//         dataIndex: "name",
//       },
//       {
//         title: "创建时间",
//         dataIndex: "create_time",
//         render:(create_time)=>formateDate(create_time)
//       },
//       {
//         title: "授权时间",
//         dataIndex: "auth_time",
//         render:(auth_time)=>formateDate(auth_time)
//       },
//       {
//         title: "授权人",
//         dataIndex: "auth_name",
//       },
//     ];
//   };
//   handleCancel = () => {
//     this.setState({ showStatus: 0 });
//   };
//   addRole = async () => {
//     const result = await reqAddRole(this.input.props.value);
//     if (result.status === 0) {
//       message.success("添加角色成功");
//       // this.getRoles()
//       // 可以不请求直接添加到roles列表
//       const role = result.data;
//       // const roles =[...this.state.roles]
//       // roles.push(role)
//       // this.setState({roles:roles})
//       this.setState((state) => ({
//         roles: [...state.roles, role],
//       }));
//     } else {
//       message.error("添加角色失败");
//     }
//     this.setState({ showStatus: 0 });
//   };
//   setRole = async() => {
//     //   console.log('select',select)
//      const menus =  this.auth.current.getMenus()
//      const role = this.state.role
//      role.menus=menus
//      role.auth_time = Date.now()
//      role.auth_name = memoryUtils.user.username
//     //  console.log(role)
//      const result = await reqUpdateRole(role)
//      if(result.status===0){
//          message.success('设置权限成功')
//          //如果更新的是自己角色权限,强制退出
//         if(memoryUtils.user.username!=='admin'&&role._id===memoryUtils.user.role_id){
//           memoryUtils.user={}
//           storageUtils.deleteUser()
//           this.props.history.replace('./login')
//           message.info('权限已更改,请重新登录')
//         }
//      }else{
//          message.error('设置权限失败')
//      }
//     this.setState({ showStatus: 0 });
//   };
//   componentDidMount() {
//     this.getRoles();
//   }
//   UNSAFE_componentWillMount() {
//     this.initColumn();
//   }
//   render() {
//     const { roles, role, showStatus } = this.state;
//     // const {username, totalHours, comments, approvalStatus,submissionStatus}=this.props.location.state.user
//     const title = (
//       <span>
//         <Button type="primary" onClick={() => this.setState({ showStatus: 1 })}>
//           创建角色
//         </Button>
//         <Button
//           type="primary"
//           onClick={() => this.setState({ showStatus: 2 })}
//           disabled={!role._id}
//         >
//           设置角色权限
//         </Button>
//       </span>
//     );

//     // console.log(roles)
//     // console.log(this.columns)
//     return (
//       <Card title={title}>
//         <Table
//           rowKey="_id"
//           pagination={{
//             pageSize: PAGE_SIZE,
//             // , total: 50
//           }}
//           dataSource={roles}
//           columns={this.columns}
//           loading={this.state.loading}
//           rowSelection={{ type: "radio", selectedRowKeys: [role._id],onSelect:(role)=>{
//             this.setState({role:role})} 
//           }} //设置单选
//           onRow={(role) => {
//             return {
//               onSelect:(event) => {
//                 this.setState({ role });
//               },
//               onClick: (event) => {
//                 this.setState({ role });
//               }, // 点击行
//               onDoubleClick: (event) => {},
//               onContextMenu: (event) => {},
//               onMouseEnter: (event) => {}, // 鼠标移入行
//               onMouseLeave: (event) => {},
//             };
//           }}
//           bordered
//         />
//         <Modal
//           title="添加角色"
//           visible={showStatus === 1}
//           onOk={this.addRole}
//           onCancel={this.handleCancel}
//           destroyOnClose={true}
//         >
//           <AddForm
//             categoryName
//             setInput={(input) => {
//               this.input = input;
//             }}
//           />
//         </Modal>
//         <Modal
//           title="设置角色权限"
//           visible={showStatus === 2}
//           onOk={this.setRole}
//           onCancel={this.handleCancel}
//           destroyOnClose={true}
//         >
//           <SetTree role={role} ref={this.auth}/>
//         </Modal>
//       </Card>
//     );
//   }
// }
export default class Role extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userInfo:{},
      
    }
    // this.buttonClick = this.buttonClick.bind(this)
    this.getUserInfo();

  }

  UNSAFE_componentWillMount() {
    this.getUserInfo();
  }

  componentDidMount = () => {
    // this.getUserInfo();
  }
  getUserInfo = async () => {
    const name = memoryUtils.user.name;
    const result = await reqUserInfo(name);
    console.log("result=>",result);
    this.setState({userInfo: result});
    console.log("this.state.userinfo=>", this.state.userInfo);
  }

  onFinish = async (values) => {
    //console.log("Received values of form: ", values);
    //
    // console.log('this----',this)
    const { username, password } = values;
    
    try {
      

   

      
    } catch (error) {
   
    }
  };



  saveUsers = async () => {   
    // this.state;
    console.log(this.state);
    const myUserInfo = this.state;
    const username = memoryUtils.user.name
    
    axios.post("api/user/userInfo?username=" + username, myUserInfo).then( res=>{
      alert("Updated successfully");
    })

  };

  handleChangeName = (event)=>{
  
    this.setState(prevState =>(
      {
        ...prevState,
        phone: event.target.value
      }
    ))
    // alert(event.target.value
    this.prevState=this.state;
    console.log(this.state)
  }

  handleChangeEmail = (event)=>{
  
    this.setState(prevState =>(
      {
        ...prevState,
        email: event.target.value
      }
    ))
    this.prevState=this.state;
    // alert(event.target.value)
    console.log(this.state)
  }
  handleChangeAddress = (event)=>{
  
    this.setState(prevState =>(
      {
        ...prevState,
        address: event.target.value
        
      }
      
    ))
    this.prevState=this.state;
    // alert(event.target.value)
    console.log(this.state)
  }
  handleSubmit= (event)=>{
   
    event.preventDefault();
}
  

  

  render() {
    const contact = this.state.userInfo.emergencyContact
    
    // this.props.form.setFieldsValue({ name:"张三", });
    return (
      
    <form onSubmit={this.handleSubmit}>
      <div>
        
        <div>
          <h3>Contact</h3>


         <label>
          <input type = 'text' placeholder='phone' defaultValue = {this.state.userInfo.phone} onChange={this.handleChangeName}/><br/>
          </label>
          <input type = 'text' placeholder='email' defaultValue = {this.state.userInfo.email} onChange={this.handleChangeEmail}/><br/>
          <input type = 'text' placeholder='address' defaultValue = {this.state.userInfo.address} onChange={this.handleChangeAddress}/><br/>
        </div>
        <div>
          {this.state.userInfo.emergencyContact && this.state.userInfo.emergencyContact.map((contact, index) =>
          <div>
            <h3>Emergency Contact {index + 1}</h3>
            {/* <input type = 'text' placeholder='First Name, Last Name' defaultValue = {contact.name} onChange={(e) => {this.setState(prevState => {let s = Object.assign({}, prevState); s.emergencyContact[index].name = e.target.value; return {s};})}}/><br/> */}
            <input type = 'text' placeholder='First Name, Last Name' defaultValue = {contact.name} /><br/>

            {/* <input type = 'text' placeholder='phone' defaultValue = {contact.phone} onChange={(e) => {this.setState(prevState => {let s = Object.assign({}, prevState); s.emergencyContact[index].phone = e.target.value; return {s};})}}/><br/> */}
            <input type = 'text' placeholder='phone' defaultValue = {contact.phone}  /><br/>

          </div>
          )}
        </div>
        <button onClick={this.saveUsers}>Save</button>
        <p>{this.state.errorMessage}</p>
      </div>
      </form>
    //   <div>
    //   <Form
    //   name="validate_other"
    //   onFinish={this.onFinish}
    
    //   initialValues={{
    //     rate: 3.5,
    //   }}
    // >
    //   <Form.Item
    //     label="name"
    //     name="name"      
    //   > 
    //     <Input defaultValue={this.state.userInfo.name} />
    //   </Form.Item>
    //   <Form.Item
    //     label="email"
    //     name="email"  
          
    //   >
       
    //     <Input defaultValue={this.state.userInfo.email}/>
    //   </Form.Item>

    //   <Form.Item
    //     label="address"
    //     name="address"      
    //   >
    //     <Input />
    //   </Form.Item>
      

    // </Form>
    // {/* <div>
    //   {contact.map((x, i) => {
    //     return <span> x.name</span>
    //   })}
    // </div> */}
    // </div>
    
    


    )
  }
}

