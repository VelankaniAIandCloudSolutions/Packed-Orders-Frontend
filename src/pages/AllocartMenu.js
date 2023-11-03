import React, { useState, useEffect } from 'react';
import logo from "../logo.jpg";
import '../resources/menu.css';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';

function AllocartMenu() {
    const [menuItems, setMenuItems] = useState([]);

    const getAllMenus = () => {
        axios.get('/api/allo/get-all-allocartmenu')
            .then((response) => {
                setMenuItems(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getAllMenus();
    }, []);

    const Menu = ({ items }) => {
        const [selectedItems, setSelectedItems] = useState({});

        const handleCheckboxChange = (menuId, itemName) => {
            setSelectedItems((prevSelectedItems) => ({
                ...prevSelectedItems,
                [menuId]: {
                    ...prevSelectedItems[menuId],
                    [itemName]: !prevSelectedItems[menuId]?.[itemName] || true,
                },
            }));
        };

        return (
            <div className="section-center">
                {items.map((menu) => (
                    <div key={menu._id} className="menu-item">
                        <div className="item-info">
                            <header>
                                <h4>{menu.title}</h4>
                            </header>
                            <ul className="item-list">
                                {menu.items.map((item) => (
                                    <li key={item.name}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={!!selectedItems[menu._id]?.[item.name]}
                                                onChange={() => handleCheckboxChange(menu._id, item.name)}
                                            />
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-price">₹{item.price.toFixed(2)}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <DefaultLayout>
            <main>
                <section className='menu sections'>
                    <div className='title'>
                        <h2>Menu List</h2>
                        <div className="underline"></div>
                    </div>
                    <Menu items={menuItems} />
                </section>
            </main>
        </DefaultLayout>
    )
}

export default AllocartMenu;
