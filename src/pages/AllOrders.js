import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Col, Row, Table, Button, Form, message, Input, Select, Modal, DatePicker, Space, } from 'antd';
import {
    DeleteOutlined,
    EditOutlined, MinusCircleOutlined, PlusOutlined, StopOutlined
} from "@ant-design/icons"
import '../resources/customer.css'
import DefaultLayout from '../components/DefaultLayout';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';


function AllOrders() {
    const [ordersData, setOrdersData] = useState([]);
    const [addEditModalVisibility, setAddEditModalVisibility] = useState(false)
    const [editingOrder, setEditingOrder] = useState(null)
    const appdata = JSON.parse(localStorage.getItem('app-user'));
    console.log(appdata);
    const role = appdata.role;
    // const dispatch = useDispatch()
    const getAllOrders = () => {
        // dispatch({ type: 'showLoading' })
        axios.get('/api/order/get-all-order', appdata).then((response) => {
            // dispatch({ type: 'hideLoading' })
            const allOrders = response.data;
            let filteredOrders = allOrders;
            if (appdata.role === 'Customer') {
                // const loggedInCustomer = getLoggedInCustomer(); // Replace with the actual function to get the logged-in customer data
                filteredOrders = allOrders.filter((order) => order.email === appdata.email);
            }
            if (appdata.role === 'Customer Admin') {
                filteredOrders = allOrders.filter((order) => order.company === appdata.company);
            }

            setOrdersData(filteredOrders);

            // setOrdersData(response.data)
        }).catch((error) => {
            // dispatch({ type: 'showLoading' })
            console.log(error)
        })
    }

    const deleteOrder = (record) => {
        axios.post('/api/order/delete-order', { orderID: record._id })
            .then((response) => {
                message.success('Order deleted Successfully')
                getAllOrders()
            })
            .catch((error) => {
                // dispatch({ type: 'showLoading' })
                message.error('Something went wrong')
                console.log(error)
            })
    }
    const closeOrder = (record) => {
        axios.post('/api/order/edit-order', {
            orderID: record._id,
            status: 'Closed' // Update the status to 'Closed'
        })
            .then((response) => {
                message.success('Order Closed Successfully');
                getAllOrders();
            })
            .catch((error) => {
                message.error('Something went wrong');
                console.log(error);
            });
    };
    const cancelOrder = (record) => {
        axios.post('/api/order/edit-order', {
            orderID: record._id,
            status: 'Cancelled' // Update the status to 'Closed'
        })
            .then((response) => {
                message.success('Order Cancelled Successfully');
                getAllOrders();
            })
            .catch((error) => {
                message.error('Something went wrong');
                console.log(error);
            });
    };

    const navigate = useNavigate();
    const handleEditOrder = (record) => {
        // Navigate to the orders page with the order data
        navigate(`/editOrder/${record._id}`);
    };
    // const handleDownloadPDF = () => {
    //     const table = document.getElementById('orders-table');
    //     html2canvas(table).then((canvas) => {
    //         const imgData = canvas.toDataURL('image/png');
    //         const pdf = new jsPDF('p', 'mm', 'a4');
    //         pdf.addImage(imgData, 'PNG', 10, 10);
    //         pdf.save('orders.pdf');
    //     });
    // };

    const columns = [
        {
            title: 'Customer Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Order Type',
            dataIndex: 'orderType',
            key: 'orderType',
        },
        {
            title: 'GST No',
            dataIndex: 'gstno',
            key: 'gstno',
        },
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
        },
        {
            title: 'GSTIN No',
            dataIndex: 'gstno',
            key: 'gstno',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Order Date Time',
            dataIndex: 'orderDateTime',
            key: 'orderDateTime',
        },
        // {
        //     title: 'Items',
        //     dataIndex: 'items',
        //     key: 'items',
        //     render: (items) => (
        //         <ul>
        //             {items.map((item, index) => (
        //                 <li key={index}>
        //                     {item.menu_name} -{item.quantity}- {item.items.join(', ')}
        //                 </li>
        //             ))}
        //         </ul>
        //     ),
        // },
        // {
        //     title: 'Download',
        //     dataIndex: '_id',
        //     key: 'download',
        //     render: () => (
        //         <Button type="primary" onClick={handleDownloadPDF}>
        //             Download PDF
        //         </Button>
        //     ),
        // },
        {
            title: 'Close',
            dataIndex: '_id',
            key: 'close',
            render: (id, record) => (
                <Button type="primary" onClick={() => closeOrder(record)} disabled={record.status !== 'Open'} >
                    Close
                </Button>
            ),
        },
        {
            title: 'Actions',
            dataIndex: '_id',
            render: (id, record) => (
                <div className="d-flex">
                    <EditOutlined
                        className='mx-2'
                        onClick={() => handleEditOrder(record)}
                    />


                    <span> </span>
                    <DeleteOutlined
                        className="mx-2"
                        onClick={() => deleteOrder(record)}
                    />
                    <span> </span>
                    {record.status === 'Open' && (
                        <StopOutlined
                            className="mx-2"
                            onClick={() => cancelOrder(record)}
                        />
                    )}
                </div>
            ),
        },
    ];


    useEffect(() => {
        getAllOrders()
    }, []);



    return (
        <DefaultLayout>
            <div className="d-flex justify-content-between align-items-center test">

                <h2 className="hclass">Orders</h2>
            </div>
            <Table id="orders-table" columns={columns} dataSource={ordersData} bordered />


        </DefaultLayout>
    )
}

export default AllOrders
