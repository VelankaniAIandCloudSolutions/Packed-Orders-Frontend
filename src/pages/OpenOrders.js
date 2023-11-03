import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Col, Row, Table, Button, Form, message, Input, Select, Modal, DatePicker, Space, } from 'antd';
import {
    DeleteOutlined,
    EditOutlined, MinusCircleOutlined, PlusOutlined, StopOutlined, EyeOutlined, FilterOutlined
} from "@ant-design/icons"
import '../resources/customer.css'
import DefaultLayout from '../components/DefaultLayout';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function OpenOrders() {
    const [ordersData, setOrdersData] = useState([]);
    const [filterOrderDate, setFilterOrderDate] = useState(null);
    const [filterStatus, setFilterStatus] = useState(null);
    const appdata = JSON.parse(localStorage.getItem('app-user'));
    console.log(appdata);
    const role = appdata.role;
    const { Option } = Select;
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
            filteredOrders.sort((a, b) => moment(b.orderDateTime).valueOf() - moment(a.orderDateTime).valueOf());
            filteredOrders = filteredOrders.filter((order) => order.status === 'Open')

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
                axios.post('/api/order/cancel-email', {
                    email: appdata.email
                })

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
            title: 'Order No',
            dataIndex: 'orderNo',
            key: 'orderNo',
        },
        {
            title: 'Customer Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Select Status"
                        value={selectedKeys}
                        onChange={(values) => {
                            setSelectedKeys(values);
                            setFilterStatus(values);
                        }}
                    >
                        <Option value="Open">Open</Option>
                        <Option value="Closed">Closed</Option>
                        <Option value="Cancelled">Cancelled</Option>
                    </Select>
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => {
                                confirm();
                            }}
                            icon={<FilterOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Filter
                        </Button>
                        <Button
                            onClick={() => {
                                clearFilters();
                                setFilterStatus(null);
                            }}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => {
                if (!filterStatus || filterStatus.length === 0) return true;
                return filterStatus.includes(record.status);
            },

        },

        {
            title: 'Order Type',
            dataIndex: 'orderType',
            key: 'orderType',
        },
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
        },
        // {
        //     title: 'GSTIN No',
        //     dataIndex: 'gstno',
        //     key: 'gstno',
        // },
        // {
        //     title: 'Address',
        //     dataIndex: 'address',
        //     key: 'address',
        // },
        {
            title: 'Order Date',
            dataIndex: 'orderDateTime',
            key: 'orderDateTime',
            render: (orderDateTime) => (
                <span>{moment(orderDateTime).format('DD-MM-YYYY')}</span>
            ),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <DatePicker
                        value={selectedKeys[0] ? moment(selectedKeys[0]) : null}
                        onChange={(date) => {
                            setSelectedKeys(date ? [date.format('YYYY-MM-DD')] : []);
                            setFilterOrderDate(date);
                        }}
                        placeholder="Select Order Date"
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => {
                                confirm();
                            }}
                            icon={<FilterOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Filter
                        </Button>
                        <Button
                            onClick={() => {
                                clearFilters();
                                setFilterOrderDate(null);
                            }}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) => {
                if (!filterOrderDate) return true;
                const recordDate = moment(record.orderDateTime).format('YYYY-MM-DD');
                return recordDate === filterOrderDate.format('YYYY-MM-DD');
            },

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
        // {
        //     title: 'Close',
        //     dataIndex: '_id',
        //     key: 'close',
        //     render: (id, record) => (
        //         <Button type="primary" onClick={() => closeOrder(record)} disabled={record.status !== 'Open'} >
        //             Close
        //         </Button>
        //     ),
        // },
        {
            title: 'Actions',
            dataIndex: '_id',
            render: (id, record) => (
                <div className="d-flex">
                    <EyeOutlined
                        className='mx-2'
                        onClick={() => handleEditOrder(record)}
                    />


                    <span> </span>
                    {role === 'admin' && (
                        <DeleteOutlined
                            className="mx-2"
                            onClick={() => deleteOrder(record)}
                        />)}
                    <span> </span>
                    {!(role === "Customer" || role === "Customer Admin") && record.status === 'Open' && (
                        <StopOutlined
                            className="mx-2"
                            onClick={() => cancelOrder(record)}

                        />
                    )}
                </div>
            ),
        },
    ];
    if (role === 'admin') {
        columns.push({
            title: 'Close',
            dataIndex: '_id',
            key: 'close',
            render: (id, record) => (
                <Button
                    type="primary"
                    onClick={() => closeOrder(record)}
                    disabled={record.status !== 'Open'}
                >
                    Close
                </Button>
            ),
        });
    }

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

export default OpenOrders
