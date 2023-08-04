import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout';
import { Col, Row, Table, Button, Form, message, Input, Select, Modal, DatePicker, Space } from 'antd';
import '../resources/order.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import logo from "../logo.jpg"

function EditOrder() {
    const { Option } = Select;
    const [ordersData, setOrdersData] = useState(null);
    const { id } = useParams();
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([]);
    const columns = [
        {
            title: 'Name',
            dataIndex: 'menu_name',
            width: 300,
        },
        {
            title: 'Items',
            dataIndex: 'items',
            width: 350,
            render: (items) => (
                <ul>
                    {items && Array.isArray(items) && items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            ),
        },
        {
            title: 'Unit Price',
            dataIndex: 'unit_price',
            width: 100,
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: 100,
        },
        {
            title: 'Total Price',
            dataIndex: 'total_price',
            width: 100,
        },
    ];

    const fetchOrderDetails = () => {

        axios.get(`/api/order/get-order/${id}`).then((response) => {
            setOrdersData(response.data)
            console.log(response.data);
        }).catch((error) => {
            console.log(error)
        })
    };


    useEffect(() => {
        fetchOrderDetails();
        console.log(ordersData);
    }, []);

    useEffect(() => {
        if (ordersData && Object.keys(ordersData).length > 0) {
            const initialValues = {
                name: ordersData.name || '',
                company: ordersData.company || '',
                email: ordersData.email || '',
                orderType: ordersData.orderType || 'Take Away',
                orderDateTime: moment(ordersData.orderDateTime),
                deliveryDateTime: moment(ordersData.deliveryDateTime),
                gstno: ordersData.gstno || '',
                dietaryRestrictions: ordersData.dietaryRestrictions || '',
                address: ordersData.address || '',
                deliveryAddress: ordersData.deliveryAddress || '',
                comments: ordersData.comments || '',
            };
            form.setFieldsValue(initialValues);
        }

        if (ordersData && ordersData.items && Array.isArray(ordersData.items)) {
            const updatedDataSource = ordersData.items.map((item, index) => ({
                key: index,
                menu_name: item.menu_name,
                items: item.items,
                unit_price: item.unit_price,
                quantity: item.quantity,
                total_price: item.total_price,
            }));

            setDataSource(updatedDataSource);
        }
    }, [ordersData, form]);




    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const handleGeneratePDF = () => {
        const formData = form.getFieldsValue();
        const subtotal = dataSource.reduce((total, item) => total + item.total_price, 0);
        const grandTotal = subtotal;



        const docDefinition = {
            content: [

                {
                    columns: [
                        {
                            stack: [
                                {
                                    text: 'Order',
                                    alignment: 'left',
                                    fontSize: 18,
                                    bold: true,
                                    margin: [0, 20],
                                    color: '#2e6e50',
                                },
                            ],
                            width: '*',
                        },
                        // {
                        //     image: logo, // Replace with the actual path to your image
                        //     width: 100, // Adjust the width of the image as needed
                        //     alignment: 'right',
                        //     margin: [0, 10],
                        // },
                    ],
                },
                {
                    columns: [
                        {
                            stack: [
                                {
                                    // width: '50%',
                                    text: `Customer Details:`,
                                    margin: [0, 0, 10, 0],
                                    bold: true,
                                },
                                {
                                    // width: '50%',
                                    text: `${formData.name}`,
                                    margin: [0, 5, 10, 0],
                                },
                                {
                                    // width: '50%',
                                    text: `${formData.company}`,
                                    margin: [0, 0, 10, 0],
                                },
                                {
                                    // width: '50%',
                                    text: `${formData.email}`,
                                    margin: [0, 0, 10, 0],
                                },
                            ],

                        },
                        {
                            stack: [
                                // {
                                //     // width: '50%',
                                //     text: `Order Details:`,
                                //     margin: [0, 0, 10, 0],
                                // },
                                // {
                                //     // width: '50%',
                                //     text: `${formData.orderType}`,
                                //     margin: [0, 0, 10, 0],
                                // },
                                // {
                                //     // width: '50%',
                                //     text: `${formData.company}`,
                                //     margin: [0, 0, 10, 0],
                                // },
                                // {
                                //     // width: '50%',
                                //     text: `${formData.email}`,
                                //     margin: [0, 0, 10, 0],
                                // },
                            ],

                        },

                        // {
                        //     image: logo, // Replace with the actual path to your image
                        //     width: 100, // Adjust the width of the image as needed
                        //     alignment: 'right',
                        //     margin: [0, 10],
                        // },
                    ],
                },
                {
                    columns: [
                        {
                            stack: [
                                {
                                    // width: '50%',
                                    text: `Order Details:`,
                                    margin: [0, 20, 10, 0],
                                    bold: true,
                                },
                                {
                                    // width: '50%',
                                    text: `${formData.orderType}`,
                                    margin: [0, 5, 10, 0],
                                },
                                {
                                    text: `Order Date: ${formData.orderDateTime.format('YYYY-MM-DD HH:mm:ss')}`,
                                    margin: [0, 0, 10, 0],
                                },
                                {
                                    text: `Delivery Date: ${formData.deliveryDateTime.format('YYYY-MM-DD HH:mm:ss')}`,
                                    margin: [0, 0, 10, 0],
                                },
                            ],

                        },

                        // {
                        //     image: logo, // Replace with the actual path to your image
                        //     width: 100, // Adjust the width of the image as needed
                        //     alignment: 'right',
                        //     margin: [0, 10],
                        // },
                    ],
                },
                {
                    columns: [
                        {
                            stack: [
                                {
                                    // width: '50%',
                                    text: `Billing Address:`,
                                    margin: [0, 20, 10, 0],
                                    bold: true,
                                },
                                {
                                    // width: '50%',
                                    text: `${formData.address}`,
                                    margin: [0, 5, 10, 0],
                                },

                            ],

                        },
                    ],
                },
                {
                    columns: [
                        {
                            stack: [
                                {
                                    // width: '50%',
                                    text: `Delivery Address:`,
                                    margin: [0, 20, 10, 0],
                                    bold: true,
                                },
                                {
                                    // width: '50%',
                                    text: `${formData.deliveryAddress}`,
                                    margin: [0, 5, 10, 0],
                                },

                            ],

                        },
                    ],
                },
                // {
                //     text: 'Billing Address',
                //     fontSize: 16,
                //     bold: true,
                //     margin: [0, 20, 0, 10],
                // },
                // {
                //     text: formData.address,
                //     margin: [0, 5],
                // },
                // {
                //     text: 'Delivery Address',
                //     fontSize: 16,
                //     bold: true,
                //     margin: [0, 20, 0, 10],
                // },
                // {
                //     text: formData.deliveryAddress,
                //     margin: [0, 5],
                // },
                {
                    text: 'Comments',
                    // fontSize: 16,
                    bold: true,
                    margin: [0, 20, 0, 10],
                },
                {
                    text: formData.comments || 'No comments provided',
                    margin: [0, 5],
                },
                {
                    text: 'Order Items',
                    // fontSize: 16,
                    bold: true,
                    margin: [0, 20, 0, 10],
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', '*', 'auto', 'auto', 'auto'],
                        body: [
                            [
                                { text: 'Name', style: 'tableHeader' },
                                { text: 'Items', style: 'tableHeader' },
                                { text: 'Unit Price', style: 'tableHeader' },
                                { text: 'Qty', style: 'tableHeader' },
                                { text: 'Total Price', style: 'tableHeader' },
                            ],
                            ...dataSource.map((item) => [
                                item.menu_name,
                                {
                                    text: item.items.map((item) => item + '\n'),
                                    style: 'tableCell'
                                },
                                item.unit_price,
                                item.quantity,
                                item.total_price,
                            ]),
                            // [
                            //     { text: 'Subtotal', colSpan: 4, alignment: 'right', style: 'tableCellBold' },
                            //     {},
                            //     {},
                            //     {},
                            //     { text: subtotal.toFixed(2), style: 'tableCellBold' },
                            // ],
                            [
                                { text: 'Grand Total', colSpan: 4, alignment: 'right', style: 'tableCellBold' },
                                {},
                                {},
                                {},
                                { text: grandTotal.toFixed(2), style: 'tableCellBold' },
                            ],
                        ],
                    },
                    layout: 'lightHorizontalLines',
                    style: 'table',
                },

                {
                    text: 'Notes',
                    // fontSize: 16,
                    bold: true,
                    margin: [0, 20, 0, 10],
                },
                {
                    text: 'Thank you for choosing us',
                    margin: [0, 5],
                },

                {
                    columns: [
                        {
                            stack: [
                                {
                                    // width: '50%',
                                    text: `Received By:`,
                                    margin: [0, 20, 10, 0],
                                    bold: true,
                                },
                            ],

                        },
                        {
                            stack: [
                                {
                                    // width: '50%',
                                    text: `Seal and Stamp:`,
                                    margin: [0, 20, 10, 0],
                                    bold: true,
                                },
                            ],

                        },

                    ],
                },

            ],
            styles: {
                table: {
                    margin: [0, 10, 0, 20],
                },
                tableHeader: {
                    bold: true,
                    // fontSize: 12,
                    color: 'black',
                    fillColor: '#EEEEEE',
                },
                tableCell: {
                    // fontSize: 10,
                    color: 'black',
                },
            },
        };

        pdfMake.createPdf(docDefinition).download('order_details.pdf');
    };

    return (
        <DefaultLayout>

            <main><section className='menu sections'>
                <div className='title '>
                    <h2>Order Details</h2>
                    <Button
                        type="primary"
                        className="pdfButton"
                        onClick={handleGeneratePDF}
                        style={{ align: 'right' }}
                    >
                        Generate PDF
                    </Button>
                </div>
                <div className='orderForm'>
                    {/* <Button
                        type="primary"
                        className="pdfButton"
                        onClick={handleGeneratePDF}
                        style={{ align: 'right' }}
                    >
                        Generate PDF
                    </Button> */}
                    <Form name="orderform" labelAlign="left" form={form}
                    >
                        <Row justify="space-between" gutter={[30, 8]}>
                            <Col span={8} >
                                <Form.Item
                                    label="Customer"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input Name!",
                                        },
                                    ]}
                                    labelCol={{ span: 8 }} // Set the label width to 8 columns
                                    wrapperCol={{ span: 16 }} // Set the input field width to 16 columns
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Company"
                                    name="company"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input company!",
                                        },
                                    ]}
                                    labelCol={{ span: 8 }} // Set the label width to 8 columns
                                    wrapperCol={{ span: 16 }} // Set the input field width to 16 columns
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your email!",
                                        },
                                    ]}
                                    labelCol={{ span: 8 }} // Set the label width to 8 columns
                                    wrapperCol={{ span: 16 }} // Set the input field width to 16 columns
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-between" gutter={[30, 8]}>
                            <Col span={8}>
                                <Form.Item
                                    label="Order Type"
                                    name="orderType"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select Order Type!",
                                        },
                                    ]}
                                    labelCol={{ span: 8 }} // Set the label width to 8 columns
                                    wrapperCol={{ span: 16 }} // Set the input field width to 16 columns
                                >
                                    <Select
                                        defaultValue="Take Away"
                                        style={{ textAlign: "left" }}
                                        dropdownStyle={{ textAlign: "left" }}
                                    >
                                        <Option value="Take Away">Take Away</Option>
                                        <Option value="Delivery">Delivery</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Order Date"
                                    name="orderDateTime"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select Order Date Time!",
                                        },
                                    ]}
                                    labelCol={{ span: 8 }} // Set the label width to 8 columns
                                    wrapperCol={{ span: 16 }} // Set the input field width to 16 columns
                                >
                                    <DatePicker
                                        showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                                        format="YYYY-MM-DD HH:mm:ss"

                                        style={{ width: "100%" }}

                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Delivery Date"
                                    name="deliveryDateTime"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select Delivery Date Time!",
                                        },
                                    ]}
                                    labelCol={{ span: 8 }} // Set the label width to 8 columns
                                    wrapperCol={{ span: 16 }} // Set the input field width to 16 columns
                                >
                                    <DatePicker
                                        showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
                                        format="YYYY-MM-DD HH:mm:ss"

                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-between" gutter={[30, 8]}>
                            <Col span={8}>
                                <Form.Item
                                    label="GST No"
                                    name="gstno"
                                    rules={[{ required: true, message: "Please input GST No!", },]}
                                    labelCol={{ span: 8 }} // Set the label width to 8 columns
                                    wrapperCol={{ span: 16 }} // Set the input field width to 16 columns
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Dietary Restrictions" name="dietaryRestrictions"
                                    labelCol={{ span: 8 }} // Set the label width to 8 columns
                                    wrapperCol={{ span: 16 }} // Set the input field width to 16 columns
                                >
                                    <Select style={{ textAlign: "left" }} >
                                        <Option value="yes">Yes</Option>
                                        <Option value="no">No</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Billing Address"
                                    name="address"
                                    rules={[{ required: true, message: "Please input Billing Address!", },]}
                                    labelCol={{ span: 8 }} // Set the label width to 8 columns
                                    wrapperCol={{ span: 16 }} // Set the input field width to 16 columns
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Delivery Address"
                                    name="deliveryAddress"
                                    rules={[{ message: "Please input Delivery Address!", },]}
                                    labelCol={{ span: 8 }} // Set the label width to 8 columns
                                    wrapperCol={{ span: 16 }} // Set the input field width to 16 columns
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="space-between" gutter={[30, 8]}>

                            <Col span={8}>
                                <Form.Item
                                    label="Comments"
                                    name="comments"
                                    labelCol={{ span: 8 }} // Set the label width to 8 columns
                                    wrapperCol={{ span: 16 }} // Set the input field width to 16 columns
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                            </Col>

                        </Row>
                        {dataSource.length > 0 && (
                            <Table columns={columns} dataSource={dataSource} />
                        )}
                        <div className="menuselection">
                            <Button htmlType="submit" type="primary">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </div>
            </section></main>
        </DefaultLayout >
    )
}

export default EditOrder