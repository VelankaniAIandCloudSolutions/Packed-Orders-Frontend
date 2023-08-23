import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, DatePicker, Select } from 'antd';
import '../resources/customer.css';
import DefaultLayout from '../components/DefaultLayout';
import { format } from 'date-fns';

const { Option } = Select;

function DayWiseSaleRport() {
    const [ordersData, setOrdersData] = useState([]);
    const [filterType, setFilterType] = useState('day');
    const [selectedDate, setSelectedDate] = useState(null);
    const columns = [
        // ... your existing columns ...
        {
            title: 'Date',
            dataIndex: 'orderDateTime',
            key: 'day',
            render: (orderDateTime) => {
                const date = new Date(orderDateTime);
                if (!isNaN(date)) {
                    return format(date, 'yyyy-MM-dd');
                } else {
                    return '';
                }
            },
        },
        {
            title: 'Total Sales',
            dataIndex: 'totalSales',
            key: 'totalSales',
        },
        // ... more columns ...
    ];

    const calculateDayWiseSales = (orders) => {
        const dayWiseSales = {};

        orders.forEach(order => {
            const orderDate = new Date(order.orderDateTime).toLocaleDateString('en-GB', { timeZone: 'UTC' });
            if (!dayWiseSales[orderDate]) {
                dayWiseSales[orderDate] = order.GrandTotal;
            } else {
                dayWiseSales[orderDate] += order.GrandTotal;
            }
        });

        const dayWiseSalesData = Object.keys(dayWiseSales).map(day => ({
            orderDateTime: day,
            totalSales: dayWiseSales[day],
        }));

        setOrdersData(dayWiseSalesData);
    };

    const getAllOrders = () => {
        axios.get('/api/order/get-all-order')
            .then(response => {
                const allOrders = response.data;
                // ... filter orders based on role ...

                // Assuming you have a field named 'totalAmount' in each order
                calculateDayWiseSales(allOrders);
            })
            .catch(error => {
                console.log(error);
            });
    };
    const handleDateFilterChange = (value) => {
        setSelectedDate(value);
    };

    const handleFilterTypeChange = (value) => {
        setFilterType(value);
        setSelectedDate(null); // Clear selected date when changing filter type
    };
    useEffect(() => {
        getAllOrders();
    }, []);

    return (
        <DefaultLayout>
            <div className="d-flex justify-content-between align-items-center test">
                <h2 className="hclass">Day-wise Sales Report</h2>
                {/* <Select defaultValue="day" onChange={handleFilterTypeChange}>
                    <Option value="day">Day</Option>
                    <Option value="month">Month</Option>
                    <Option value="year">Year</Option>
                </Select>
                {filterType !== 'year' && (
                    <DatePicker
                        value={selectedDate}
                        onChange={handleDateFilterChange}
                        placeholder="Select Date"
                    />
                )} */}
            </div>
            <Table id="orders-table" columns={columns} dataSource={ordersData} bordered />
        </DefaultLayout>
    )
}

export default DayWiseSaleRport
