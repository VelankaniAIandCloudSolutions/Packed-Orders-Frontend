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
    const [activeMenus, setActiveMenus] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);
    // const [categories, setCategories] = useState(allCategories);
    // const getAllMenus = () => {
    //     axios.get('/api/menu/get-all-menu').then((response) => {
    //         setMenuItems(response.data)

    //     }).catch((error) => {
    //         console.log(error)
    //     })
    // }


    const menuItems = [
        {
            _id: '1',
            title: 'Packed Lunch Offerings',
            submenus: [
                {
                    id: '1',
                    title: 'Asian Menu Package'
                },
                {
                    id: '2',
                    title: 'South Indian Menu Package'
                },
                {
                    id: '3',
                    title: 'Thai Menu Package'
                },
                {
                    id: '4',
                    title: 'North Indian Menu Package'
                },
                {
                    id: '5',
                    title: 'International Menu Package'
                },
            ]
        },
        {
            _id: '2',
            title: 'Executive Lunch Packages',
            submenus: [
                {
                    id: '6',
                    title: 'Indian Working Lunch'
                },
                {
                    id: '7',
                    title: 'Biriyani Package'
                },
                {
                    id: '8',
                    title: 'Asian Menu Package'
                },
                {
                    id: '9',
                    title: 'International Working Lunch'
                },
                {
                    id: '10',
                    title: 'Thai Menu Package'
                },
                {
                    id: '11',
                    title: 'South Indian Menu Package'
                },
                {
                    id: '12',
                    title: 'North Indian Menu Package'
                },
                {
                    id: '13',
                    title: 'International Menu Package'
                },
            ]

        },
        {
            _id: '3',
            title: 'Add Ons & Snacks',
            submenus: [
                {
                    id: '14',
                    title: 'Snacks Menu'
                },
                {
                    id: '15',
                    title: 'Add Ons'
                },

            ]
        },
        // Add more menu items as needed
    ];

    const handleMenuClick = (itemId) => {
        if (activeMenus.includes(itemId)) {
            // If the clicked menu is already active, collapse it
            setActiveMenus(activeMenus.filter(id => id !== itemId));
        } else {
            // Expand the clicked menu and collapse others
            setActiveMenus([itemId]);
        }
    };
    const Menu = ({ items }) => {
        return (
            <div className="section-center1">
                {items.map((item) => {
                    const { _id, title, submenus } = item;
                    const isActive = activeMenus.includes(_id);

                    return (
                        <div key={_id} className="menu-item1">
                            <div className="item-info1">
                                <header>
                                    <h4 onClick={() => handleMenuClick(_id)}>
                                        {title}
                                    </h4>
                                </header>
                            </div>
                            {isActive && (
                                <div className="submenu1">
                                    {submenus.map((submenu) => (
                                        <Link to={`/secondmenu/${submenu.id}`} key={submenu.id} className="submenu-item1">
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

