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
function MenuSelection(rootReducer) {
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
        axios.get(`/api/menu/get-menu/${id}`).then((response) => {
            setMenuItems(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        getMenuById()

    }, [])

    // const getSelectedValues = () => {
    //     console.log(value);
    //     return value.map((selectedValue, index) => {
    //         const selectedItem = menuItems.items[index];
    //         return {
    //             name: selectedItem.name,
    //             selectedOption: selectedValue,
    //         };
    //     });
    // };
    const handleCheckboxChange = (e, index) => {
        const selectedValue = e.target.value;
        setValue((prevValue) => {
            const updatedValue = [...prevValue];
            if (prevValue[index] === selectedValue) {
                updatedValue[index] = null;
            } else {
                updatedValue[index] = selectedValue;
            }
            return updatedValue;
        });
    };

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
        let leftItems = [];
        let rightItems = [];

        if (menuItems.items) {
            for (let i = 0; i < menuItems.items.length; i++) {
                const obj = menuItems.items[i];
                let options = null; // Declare options variable

                if (Object.keys(obj).length > 1) {
                    options = Object.keys(obj).map((prop) => {
                        if (prop !== "_id") {
                            return (
                                <Checkbox
                                    key={obj[prop]}
                                    value={obj[prop]}
                                    onChange={(e) => handleCheckboxChange(e, i)}
                                    checked={value[i] === obj[prop]}
                                    disabled={value[i] && value[i] !== obj[prop]}
                                >
                                    {obj[prop]}
                                </Checkbox>
                            );
                        }
                    });

                    rightItems.push(
                        <div key={i}>
                            <h4 class="checkboxhead">{`Please Select One`}</h4>
                            {options}
                        </div>
                    );
                } else {
                    // Only one option available
                    const optionValue = Object.values(obj)[0];
                    options = (
                        <Checkbox
                            key={optionValue}
                            value={optionValue}
                            onChange={(e) => handleCheckboxChange(e, i)}
                            checked={value[i] === optionValue}
                        >
                            {optionValue}
                        </Checkbox>
                    );

                    // Set the default value
                    if (!value[i]) {
                        setValue((prevValue) => {
                            prevValue[i] = optionValue;
                            return [...prevValue];
                        });
                    }

                    leftItems.push(options);
                }
            }
        }

        return (
            <div className="checkbox-container">
                <div className="left-checkboxes">{leftItems}</div>
                <div className="right-checkboxes">{rightItems}</div>
            </div>
        );
    };



    // useEffect(() => {
    //     renderItems();
    // }, [menuItems]);

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
                    <h4>Please enter the Quantity below:</h4>
                    <InputNumber
                        min={1}
                        value={quantity}
                        onChange={(value) => setQuantity(value)}
                    />
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

export default MenuSelection;