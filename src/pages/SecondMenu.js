import React, { useState, useEffect } from 'react'
// import items from "../data"
import logo from "../logo.jpg"
import '../resources/menu.css';
import Categories from "./Categories"
import DefaultLayout from '../components/DefaultLayout';
import MobileLayout from '../components/MobileLayout';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// const allCategories = ["all", ...new Set(items.map((item) => item.category))];

function SecondMenu() {
    const { category } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState("");
    console.log(category);
    // const [categories, setCategories] = useState(allCategories);
    const getAllMenus = () => {
        axios.get('/api/menu/get-all-menu').then((response) => {
            const allItems = response.data;
            const filteredItems = allItems.filter(item => item.category === category);
            setMenuItems(filteredItems)

        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getAllMenus()
    }, [])

    const Menu = ({ items }) => {
        return (
            <div className="section-center">
                {items.map((item) => {
                    const { _id, title, img, desc, price } = item;
                    const descLines = desc && typeof desc === "string" ? desc.split(",") : [];
                    return (
                        // <Link to={`/menu/${title}`}
                        <Link to={`/menu/${_id}`} key={_id} className="menu-item "><div className="item-info">
                            <header>
                                <h4 >{title}  </h4>
                                <h4 className="price"> ₹{price}</h4>
                            </header>

                            <p className="item-text">
                                {descLines.map((line, index) => (
                                    <React.Fragment key={index}>
                                        <span>{line}</span>
                                        <br />
                                    </React.Fragment>
                                ))}
                            </p>


                        </div></Link>)
                })}
            </div>
        )
    }

    // const filterItems = (category) => {
    //     setActiveCategory(category);
    //     if (category === "all") {
    //         setMenuItems(items)
    //         return
    //     }
    //     const newItems = items.filter((item) => item.category === category);
    //     setMenuItems(newItems);
    // }

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

export default SecondMenu
