import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    HomeOutlined,
    UnorderedListOutlined,
    LogoutOutlined,
    ShoppingCartOutlined,
    FileOutlined,
} from '@ant-design/icons';
import '../resources/layout.css'
import { Layout, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
const { Header, Sider, Content } = Layout;

const DefaultLayout = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const { cartItems, loading } = useSelector(state => state.rootReducer)
    const appdata = JSON.parse(localStorage.getItem('app-user'));
    console.log(appdata);


    const role = appdata.role;
    const username = appdata.name;
    console.log(role);
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }, [cartItems])

    return (
        <Layout>
            {loading && (
                <div className='spinner'>
                    <div class="spinner-border" role="status">
                        <span class="sr-only"></span>
                    </div>
                </div>
            )}
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo">
                    <img width="50" height="50" src="https://i.postimg.cc/qq8HjkYN/oterra-logo.jpg" alt="" />
                </div>
                <div className='cart-count d-flex align-items-center' >

                    <b><p className='mt-3 mr-2'>{username}</p></b>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}>

                    <Menu.Item key="/menu" icon={<HomeOutlined />}>
                        <Link to='/menu'>Menu</Link>
                    </Menu.Item>
                    {role !== 'Customer' && (
                        <Menu.Item key="/customer" icon={<UserOutlined />}>
                            <Link to='/customer'>Customers</Link>
                        </Menu.Item>
                    )}
                    <Menu.Item key="/allorder" icon={<UnorderedListOutlined />}>
                        <Link to='/allorder'>Orders</Link>
                    </Menu.Item>
                    {(role === 'Customer' || role === 'Customer Admin') && (
                        <Menu.Item key="/cart" icon={<ShoppingCartOutlined />}>
                            <Link to='/cart'>Carts</Link>
                        </Menu.Item>
                    )}
                    <Menu.SubMenu key="reports" icon={<FileOutlined />} title="Reports">
                        <Menu.Item key="/dayreport">
                            <Link to='/dayreport'>Day Wise Sale Report</Link>
                        </Menu.Item>
                        <Menu.Item key="/itemreport">
                            <Link to='/itemreport'>Item Wise Sale Report</Link>
                        </Menu.Item>
                        <Menu.Item key="/companyreport">
                            <Link to='/companyreport'>Company Wise Sale Report</Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={() => {
                        localStorage.removeItem('app-user')
                        navigate('/login')
                    }}>
                        Logout
                    </Menu.Item>

                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{
                        padding: 10,
                    }}
                >
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}

                    <div className='cart-count d-flex align-items-center' onClick={() => navigate('/cart')}>

                        <b><p className='mt-3 mr-2'>{cartItems.length}<ShoppingCartOutlined /></p></b>
                    </div>

                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '10px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {props.children}
                </Content>
            </Layout>
        </Layout>
    );

};
export default DefaultLayout;