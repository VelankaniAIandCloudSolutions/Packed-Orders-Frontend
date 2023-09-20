import React, { useState, useEffect } from 'react'
// import items from "../data"
import logo from "../logo.jpg"
import '../resources/firstmenu.css';
import Categories from "./Categories"
import DefaultLayout from '../components/DefaultLayout';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

function FirstMenu() {
    // const [menuItems, setMenuItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState("");
    const [activeMenu, setActiveMenu] = useState(null);
    // const [categories, setCategories] = useState(allCategories);
    // const getAllMenus = () => {
    //     axios.get('/api/menu/get-all-menu').then((response) => {
    //         setMenuItems(response.data)

    //     }).catch((error) => {
    //         console.log(error)
    //     })
    // }

    useEffect(() => {
        // getAllMenus()
    }, [])
    const menuItems = [
        {
            _id: '1',
            title: 'Packed Lunch Offerings',
            submenus: [
                {
                    title: 'Asian Menu Package'
                },
                {
                    title: 'South Indian Menu Package'
                },
                {
                    title: 'Thai Menu Package'
                },
                {
                    title: 'North Indian Menu Package'
                },
                {
                    title: 'International Menu Package'
                },
            ]
        },
        {
            _id: '2',
            title: 'Executive Lunch Packages',

        },
        {
            _id: '3',
            title: 'Add Ons & Snacks',

        },
        // Add more menu items as needed
    ];
    const Menu = ({ items }) => {
        return (
            <div className="section-center">
                {items.map((item) => {
                    const { _id, title, submenus } = item;
                    const isActive = _id === activeMenu;

                    return (
                        <div key={_id} className="menu-item">
                            <div className="item-info">
                                <header>
                                    <h4 onClick={() => setActiveMenu(isActive ? null : _id)}>
                                        {title}
                                    </h4>
                                </header>
                            </div>
                            {isActive && (
                                <div className="submenu">
                                    {submenus.map((submenu) => (
                                        <Link to={`/menu/${submenu._id}`} key={submenu._id} className="submenu-item">
                                            <h4>{submenu.title}</h4>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };
    return (
        <DefaultLayout>
            <main>
                <section className='menu sections'>
                    <div className='title'>
                        {/* <img src={logo} alt="logo" className="logo" /> */}
                        <h2>Menu List</h2>
                        <div className="underline"></div>
                    </div>
                    {/* <Categories categories={categories} activeCategory={activeCategory} filterItems={filterItems} /> */}
                    <Menu items={menuItems} />
                </section>
            </main>
        </DefaultLayout>
    )
}

export default FirstMenu

