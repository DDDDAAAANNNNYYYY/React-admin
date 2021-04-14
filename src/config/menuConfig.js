import {HomeOutlined,AppstoreAddOutlined,BarsOutlined,ToolOutlined,UserOutlined,SafetyOutlined,AreaChartOutlined,BarChartOutlined,PieChartFilled,LineChartOutlined} from '@ant-design/icons';

const menuList = [
  {
    title: "Home", // 菜单标题名称
    key: "/home", // 对应的 path
    icon: <HomeOutlined/>, // 图标名称
  },
  {
    title: "Summary",
    key: "/user",
    icon: <UserOutlined />,
  },
  {
    title: "TimeSheet",
    key: "/product",
    icon: <AppstoreAddOutlined />,
    // children: [
    //   // 子菜单列表
    //   {
    //     title: "品类管理",
    //     key: "/category",
    //     icon: <BarsOutlined />,
    //   },
    //   {
    //     title: "商品管理",
    //     key: "/product",
    //     icon: <ToolOutlined />,
    //   },
    // ],
  },
  
  {
    title: "Profile",
    key: "/role",
    icon: <SafetyOutlined />,
  }
  
];
export default menuList;
