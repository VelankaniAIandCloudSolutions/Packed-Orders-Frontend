import React, { useState, useEffect } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import axios from 'axios';
import '../resources/allocartmenu.css';
import {
    ShoppingCartOutlined
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Radio, Select, InputNumber, Checkbox, Row, Col } from 'antd';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { rootReducer } from '../redux/rootReducer'
function TestMenu() {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); // State to store selected items

    const allvalues = [];
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const handleCheckboxChange = (menuItemIndex, itemIndex) => {
        // Toggle the checkbox state for the selected item
        const updatedMenuItems = [...menuItems];
        updatedMenuItems[menuItemIndex].items[itemIndex].selected = !updatedMenuItems[menuItemIndex].items[itemIndex].selected;
        setMenuItems(updatedMenuItems);

        const selectedItem = updatedMenuItems[menuItemIndex].items[itemIndex];
        if (selectedItem.selected) {
            setSelectedItems([...selectedItems, selectedItem]);
        } else {
            setSelectedItems(selectedItems.filter((item) => item !== selectedItem));
        }

    }

    const handlePlaceOrder = () => {
        selectedItems.forEach((item) => {
            const orderdetails = {
                menu_id: item._id, // Use the unique identifier of the item
                menu_name: item.name, // Use the item name
                quantity: 1, // You can change this if you want to allow selecting quantities
                unit_price: item.price,
                total_price: item.price, // For a single item, the total price is the same as the unit price
                items: [item.name] // You can modify this as needed
            };

            dispatch({ type: 'addToCart', payload: { orderdetails } });
        });

        // Clear the selected items
        setSelectedItems([]);

        // Navigate to the cart page
        navigate('/cart');

    }
    return (
        <DefaultLayout>
            <main>
                <section>

                    <div className='title'>
                        <h2>Menu List<div className="add-to-cart-button">
                            <Button type="primary" icon={<ShoppingCartOutlined />} className="cart-button" onClick={handlePlaceOrder}>
                                Add to Cart
                            </Button>
                        </div></h2>
                    </div>
                    <div className="menu-container">
                        {menuItems.map((menuItem, menuItemIndex) => (
                            <div key={menuItemIndex}>
                                <h3>{menuItem.title}</h3>
                                <table className='allocart'>
                                    <tbody>
                                        {menuItem.items.map((item, itemIndex) => (
                                            <tr key={itemIndex}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={item.selected || false}
                                                        onChange={() => handleCheckboxChange(menuItemIndex, itemIndex)}
                                                    />
                                                </td>
                                                <td>{item.name}</td>
                                                <td>Price: ₹{item.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </DefaultLayout>
    )
}

export default TestMenu;
