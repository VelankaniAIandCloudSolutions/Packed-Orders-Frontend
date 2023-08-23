import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import '../resources/customer.css';
import DefaultLayout from '../components/DefaultLayout';

function ItemSaleReport() {
    const [itemSalesData, setItemSalesData] = useState([]);

    const columns = [
        {
            title: 'Item Name',
            dataIndex: 'menuName',
            key: 'menuName',
        },
        {
            title: 'Total Sales Quantity',
            dataIndex: 'totalSalesQuantity',
            key: 'totalSalesQuantity',
        },
        {
            title: 'Total Sales Amount',
            dataIndex: 'totalSalesAmount',
            key: 'totalSalesAmount',
        },
    ];

    const fetchItemSalesData = () => {
        // Fetch item sales data from API or database
        axios.get('/api/order/get-all-order')
            .then(response => {
                const orders = response.data;
                const itemSales = {};

                orders.forEach(order => {
                    order.items.forEach(item => {
                        if (!itemSales[item.menu_name]) {
                            itemSales[item.menu_name] = {
                                menuName: item.menu_name,
                                totalSalesQuantity: item.quantity, // Corrected property name
                                totalSalesAmount: item.total_price,
                            };
                        } else {
                            itemSales[item.menu_name].totalSalesQuantity += item.quantity; // Corrected property name
                            itemSales[item.menu_name].totalSalesAmount += item.total_price;
                        }
                    });
                });

                const itemSalesData = Object.values(itemSales);
                setItemSalesData(itemSalesData);
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchItemSalesData();
    }, []);

    return (
        <DefaultLayout>
            <div className="d-flex justify-content-between align-items-center test">
                <h2 className="hclass">Item Sale Report</h2>
            </div>
            <Table columns={columns} dataSource={itemSalesData} bordered />
        </DefaultLayout>
    );
}

export default ItemSaleReport;
