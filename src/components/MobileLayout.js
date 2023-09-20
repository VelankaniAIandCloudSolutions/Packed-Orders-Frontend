import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UnorderedListOutlined,
    ShoppingCartOutlined,
    FileOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Header, Content } = Layout;

const MobileLayout = (props) => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(true);
    const { cartItems, loading } = useSelector(state => state.rootReducer);
    const appdata = JSON.parse(localStorage.getItem('app-user'));
    const username = appdata.name;

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <Layout>
            {loading && (
                <div className='spinner'>
                    <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            )}
            <Header
                className="site-layout-background"
                style={{
                    padding: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                {collapsed ? (
                    <MenuUnfoldOutlined
                        className='trigger'
                        onClick={() => setCollapsed(!collapsed)}
                    />
                ) : (
                    <MenuFoldOutlined
                        className='trigger'
                        onClick={() => setCollapsed(!collapsed)}
                    />
                )}

                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                >
                    <Menu.Item key="/menu" icon={<UnorderedListOutlined />}>
                        <Link to='/menu'>Menu</Link>
                    </Menu.Item>
                    <Menu.Item key="/cart" icon={<ShoppingCartOutlined />}>
                        <Link to='/cart'>Cart</Link>
                    </Menu.Item>
                    <Menu.Item key="/reports" icon={<FileOutlined />}>
                        <Link to='/reports'>Reports</Link>
                    </Menu.Item>
                </Menu>
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
    );
};

export default MobileLayout;
