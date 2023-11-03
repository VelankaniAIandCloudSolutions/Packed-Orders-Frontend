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
    const { cartItems } = useSelector(state => state.rootReducer);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDeleteItem = (index) => {
        dispatch({
            type: 'deleteFromCart',
            payload: index,
        });
    };

    const handleIncreaseQuantity = (index) => {
        dispatch({
            type: 'increaseQuantity',
            payload: index,
        });
    };

    const handleDecreaseQuantity = (index) => {
        dispatch({
            type: 'decreaseQuantity',
            payload: index,
        });
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
            render: (quantity, record, index) => (
                <div className="quantity-container">
                    <MinusCircleOutlined
                        onClick={() => handleDecreaseQuantity(index)}
                        className="quantity-action"
                    />
                    <span className="quantity">{quantity}</span>
                    <PlusCircleOutlined
                        onClick={() => handleIncreaseQuantity(index)}
                        className="quantity-action"
                    />
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
            render: (id, record, index) => (
                <DeleteOutlined onClick={() => handleDeleteItem(index)} />
            ),
        },
    ];

    const handlePlaceOrder = () => {
        const orderdetails = cartItems.map((item) => ({
            key: item.orderdetails.id,
            menu_name: item.orderdetails.menu_name,
            items: item.orderdetails.items,
            unit_price: item.orderdetails.unit_price,
            quantity: item.orderdetails.quantity,
            total_price: item.orderdetails.total_price,
        }));
        navigate('/order', { state: orderdetails });
    };

    return (
        <DefaultLayout>
            <h3>
                {cartItems && cartItems.length > 0 ? (
                    <>
                        <Button
                            type="primary"
                            onClick={() => (window.location.href = '/menu')}
                            className="back_btn"
                        >
                            Go to Menu
                        </Button>
                    </>
                ) : (
                    <></>
                )}
                Cart{' '}
                {cartItems && cartItems.length > 0 ? (
                    <>
                        <Button
                            type="primary"
                            onClick={handlePlaceOrder}
                            className="order_btn"
                        >
                            Checkout
                        </Button>
                    </>
                ) : (
                    <></>
                )}
            </h3>
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

export default CartPage;
