import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Badge } from 'antd';
import moment from 'moment';
import '../resources/customer.css';
import DefaultLayout from '../components/DefaultLayout';
import { useNavigate } from 'react-router-dom';

function CalendarView() {
    const [ordersData, setOrdersData] = useState([]);
    const appdata = JSON.parse(localStorage.getItem('app-user'));
    const role = appdata.role;
    const navigate = useNavigate();
    useEffect(() => {
        // Fetch orders data
        axios.get('/api/order/get-all-order', appdata)
            .then((response) => {
                const allOrders = response.data;
                let filteredOrders = allOrders;
                if (appdata.role === 'Customer') {
                    filteredOrders = allOrders.filter((order) => order.email === appdata.email);
                }
                if (appdata.role === 'Customer Admin') {
                    filteredOrders = allOrders.filter((order) => order.company === appdata.company);
                }
                filteredOrders.sort((a, b) => moment(b.orderDateTime).valueOf() - moment(a.orderDateTime).valueOf());
                setOrdersData(filteredOrders);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [appdata]);

    function dateCellRender(value) {
        const date = value.format('YYYY-MM-DD');
        const eventsForDate = ordersData.filter((order) => moment(order.orderDateTime).format('YYYY-MM-DD') === date);

        return (
            <ul className="events">
                {eventsForDate.map((order) => (
                    <li key={order._id}>
                        <Badge status="success" text={`${order.orderNo} - ${order.name}`}
                            onClick={() => handleEventClick(order._id)} />
                    </li>
                ))}
            </ul>
        );
    }
    const handleEventClick = (orderId) => {

        navigate(`/editOrder/${orderId}`);
    }
    return (
        <DefaultLayout>
            <div className="d-flex justify-content-between align-items-center test">
                <h2 className="hclass">Orders</h2>
            </div>
            <Calendar dateCellRender={dateCellRender} />
        </DefaultLayout>
    );
}

export default CalendarView;
