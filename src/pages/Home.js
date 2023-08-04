import React, { useEffect, useState } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import Sidebar from '../components/Sidebar';
import axios from 'axios'
import { Col, Row } from 'antd';
import Men from '../components/men';
// import { useLocation } from 'react-router-dom';


function Home() {
    // const location = useLocation();
    // console.log(location.state)
    const [menuData, setMenuData] = useState([])
    const getAllMenus = () => {
        axios.get('/api/menu/get-all-menu').then((response) => {
            setMenuData(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getAllMenus()
    }, [])
    return (
        <Sidebar>
            <Row gutter={20}>

                {menuData.map((menus) => {
                    return <Col xs={24} lg={6} md={8} sm={12}>
                        <Men menus={menus}></Men>
                    </Col>
                })}
            </Row>
        </Sidebar>
    )
}

export default Home

