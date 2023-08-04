import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DefaultLayout from '../components/DefaultLayout';
import { Button, Modal, Select, Form, Input, message, Table } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import {
    DeleteOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined
} from '@ant-design/icons';
import '../resources/cart.css';

function CartPage() {
    const { cartItems } = useSelector(state => state.rootReducer)
    console.log(cartItems);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const deleteFromCart = (index) => {
        return {
            type: 'deleteFromCart',
            payload: index,
        };
    };
    const handleDeleteItem = (index) => {
        dispatch(deleteFromCart(index));
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: ['orderdetails', 'menu_name'],
        },
        {
            title: 'Items',
            dataIndex: ['orderdetails', 'items'],
            render: (items) => (
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            ),
        },
        {
            title: 'Unit Price',
            dataIndex: ['orderdetails', 'unit_price'],
        },
        {
            title: 'Qty',
            dataIndex: ['orderdetails', 'quantity'],
            render: (quantity, record) => (
                <div className="quantity-container">

                    <span className="quantity">{quantity}</span>

                </div>
            ),
        },
        {
            title: 'Total Price',
            dataIndex: ['orderdetails', 'total_price'],
        },
        {
            title: 'Action',
            dataIndex: 'menu_id',
            render: (id, record, index) =>

                <DeleteOutlined onClick={() => handleDeleteItem(index)} />
        }
    ];

    // useEffect(() => {
    //     let temp = 0;
    //     cartItems.forEach((item) => {
    //         temp = temp + (item.Item_Price * item.quantity)
    //     })



    // }, [cartItems])
    const handlePlaceOrder = () => {
        // Prepare the order details to send to the server
        const orderdetails = cartItems.map((item) => ({
            key: item.orderdetails.id, // Assuming 'id' is a unique identifier for each item
            menu_name: item.orderdetails.menu_name,
            items: item.orderdetails.items,
            unit_price: item.orderdetails.unit_price,
            quantity: item.orderdetails.quantity,
            total_price: item.orderdetails.total_price,
        }));
        console.log(orderdetails);
        navigate('/order', { state: orderdetails })
        // Send the order details to the server
        // axios
        //   .post('/api/orders/place-order', { orders })
        //   .then(response => {
        //     // Handle the successful response from the server
        //     message.success('Order placed successfully!');
        //     // Clear the cart after placing the order
        //     dispatch({ type: 'RESET_CART' });
        //     // Navigate to the order success page or any other desired page
        //     navigate('/order-success');
        //   })
        //   .catch(error => {
        //     // Handle the error response from the server
        //     console.log(error);
        //     message.error('Failed to place the order. Please try again.');
        //   });
    };
    return (
        <DefaultLayout>
            <h3>{cartItems && cartItems.length > 0 ? (<>    <Button type="primary" onClick={() => (window.location.href = '/menu')} className="back_btn">
                Go to Menu
            </Button></>) : (<> </>)}Cart  {cartItems && cartItems.length > 0 ? (<>    <Button type="primary" onClick={handlePlaceOrder} className="order_btn">
                Checkout
            </Button></>) : (<> </>)}</h3>
            {cartItems && cartItems.length > 0 ? (
                <>
                    <Table columns={columns} dataSource={cartItems} bordered pagination={false} />
                </>
            ) : (
                <p>No items in the cart.</p>
            )}
            <hr />
        </DefaultLayout>
    );
}

export default CartPage
