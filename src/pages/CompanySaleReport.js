import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import '../resources/customer.css';
import DefaultLayout from '../components/DefaultLayout';

function CompanySaleReport() {
    const [companySalesData, setCompanySalesData] = useState([]);

    const columns = [
        {
            title: 'Company Name',
            dataIndex: 'companyName',
            key: 'companyName',
        },
        {
            title: 'Item Name',
            dataIndex: 'itemName',
            key: 'itemName',
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

    const fetchCompanyWiseSalesData = () => {
        // Fetch sales data from API or database
        axios.get('/api/order/get-all-order')
            .then(response => {
                const orders = response.data;
                const companySales = {};

                orders.forEach(order => {
                    const companyName = order.company;

                    if (!companySales[companyName]) {
                        companySales[companyName] = {};
                    }

                    order.items.forEach(item => {
                        if (!companySales[companyName][item.menu_name]) {
                            companySales[companyName][item.menu_name] = {
                                companyName: companyName,
                                itemName: item.menu_name,
                                totalSalesQuantity: 0,
                                totalSalesAmount: 0,
                            };
                        }

                        companySales[companyName][item.menu_name].totalSalesQuantity += item.quantity;
                        companySales[companyName][item.menu_name].totalSalesAmount += item.total_price;
                    });
                });

                const companySalesData = [];
                Object.keys(companySales).forEach(companyName => {
                    const items = Object.values(companySales[companyName]);
                    companySalesData.push(...items);
                });

                setCompanySalesData(companySalesData);
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchCompanyWiseSalesData();
    }, []);

    return (
        <DefaultLayout>
            <div className="d-flex justify-content-between align-items-center test">
                <h2 className="hclass">Company-wise Sale Report</h2>
            </div>
            <Table columns={columns} dataSource={companySalesData} bordered />
        </DefaultLayout>
    );
}

export default CompanySaleReport
