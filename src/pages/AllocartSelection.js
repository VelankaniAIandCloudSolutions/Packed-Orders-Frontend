import React, { useState, useEffect } from 'react';
import '../resources/menuselection.css';
import DefaultLayout from '../components/DefaultLayout';
import { Button, Radio, Select, InputNumber, Checkbox, Row, Col } from 'antd';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios, { all } from 'axios';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { rootReducer } from '../redux/rootReducer'
import {
    ShoppingCartOutlined
} from '@ant-design/icons';
function AllocartSelection(rootReducer) {
    const [menuItems, setMenuItems] = useState([]);
    const [dropdownvalue, setdropdownvalue] = useState([]);
    const allvalues = [];
    const [value, setValue] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    const navigate = useNavigate();
    const appdata = JSON.parse(localStorage.getItem('app-user'));
    console.log(appdata);
    const getMenuById = () => {
        axios.get(`/api/allo/get-allocartmenu/${id}`).then((response) => {
            setMenuItems(response.data)
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getMenuById()

    }, [])




    const dispatch = useDispatch()
    const handlePlaceOrder = () => {
        const finalvalues = value.filter(Boolean);
        console.log(finalvalues);
        allvalues.push(...finalvalues);
        console.log(allvalues);
        // console.log("Hii place order");
        const orderdetails = {
            menu_id: menuItems._id,
            menu_name: menuItems.title,
            quantity: quantity,
            unit_price: menuItems.price,
            total_price: quantity * menuItems.price,
            items: allvalues
        };
        // orderdetails.set("menu_id", menuItems._id);
        // orderdetails.set("menuname", menuItems.title);
        // orderdetails.set("quantity", quantity);
        // orderdetails.set("items", allvalues);
        console.log(`order details======${orderdetails}`);
        console.log(`menu items format======${menuItems}`);
        console.log("order details ======", orderdetails);
        console.log("menu items format ======", menuItems);

        // const menuid = menuItems._id;
        // console.log(menuItems._id);
        // console.log(quantity);
        // const itemsselected = allvalues.filter(" ");
        // console.log(allvalues.length);
        // console.log(value.length);
        // console.log(`all values===${allvalues}`);
        // console.log(...allvalues);
        // console.log(`use state component====${value}`);
        // console.log(`filtered values===${itemsselected}`);
        // const dispatch = useDispatch()
        // function addToCart() {
        //     dispatch({ type: 'addToCart', payload: { ...item, quantity: 1 } })
        // }
        dispatch({ type: 'addToCart', payload: { orderdetails } })
        navigate('/cart')
    }
    const renderItems = () => {
        if (menuItems.items && menuItems.items.length > 0) {
            return (
                <div className="items-list">
                    {menuItems.items.map((item, index) => (
                        <div key={index} className="item-row">
                            <div className="item-details">
                                <Checkbox
                                    value={item.name} // Assuming 'name' is a unique identifier
                                    // Handle checkbox change
                                    checked={value.includes(item.name)} // Check if the item is in the 'value' array
                                >
                                    {item.name} - ₹{item.price}
                                </Checkbox>
                            </div>
                            <div className="item-quantity">
                                <InputNumber
                                    min={0}
                                    defaultValue={0} // You can set the default value to 0 or any other initial quantity
                                // Handle quantity change
                                />
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            return <p>No items available.</p>;
        }
    };










    return (
        <DefaultLayout>
            <main><section className='menu sections'>
                <div className='title'>
                    <h2>{menuItems.title} - ₹{menuItems.price}<div className="add-to-cart-button">
                        <Button type="primary" icon={<ShoppingCartOutlined />} className="cart-button" onClick={handlePlaceOrder}>
                            Add to Cart
                        </Button>
                    </div></h2>

                    <div className="underline"></div>
                    {/* <p>{menuItems.desc}</p> */}
                    <p></p>

                </div>
                {renderItems()}
                {/* <div className="menuselection">
                    <Button type="primary" onClick={handlePlaceOrder} >
                        Proceed
                    </Button>
                </div> */}
            </section></main>
        </DefaultLayout >
    )
}

export default AllocartSelection;