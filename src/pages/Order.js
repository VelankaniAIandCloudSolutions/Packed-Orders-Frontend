import React, { useState, useEffect } from 'react';
import DefaultLayout from '../components/DefaultLayout';
import { Col, Row, Table, Button, Form, message, Input, Select, Modal, DatePicker, Space, InputNumber } from 'antd';
import '../resources/order.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { useDispatch } from 'react-redux';
// import sendEmail from '../../../utils/sendEmail';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';




function Order() {

    const { Option } = Select;
    const [form] = Form.useForm();
    const [orderType, setOrderType] = useState('Take Away');
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showComments, setShowComments] = useState(false);
    const [showDeliveryAddress, setDeliveryAddress] = useState(false);
    const orderdetails = Array.isArray(location.state) ? location.state : [location.state];
    console.log(orderdetails);
    const orderdata = orderdetails.filter(order => order && order.orderdetails && order.orderdetails.length > 0);


    console.log(orderdata);
    const defaultDateTime = moment();


    const [Subtotal, setSubtotal] = useState(0);
    const [Taxamount, setTaxamount] = useState(0);
    const [GrandTotal, setGrandTotal] = useState(0);
    const [TaxRate, setTaxRate] = useState(18);

    const calculateTotals = (orderDetails) => {
        console.log("After calculate total");
        // if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
        //     console.log(orderdetails);
        //     // Handle the case when orderDetails is empty or not an array
        //     setSubtotal(0);
        //     setTaxamount(0);
        //     setGrandTotal(0);
        //     return;
        // }

        // Calculate the subtotal by summing the total prices of items
        const subTotalValue = orderDetails.reduce((total, item) => total + item.total_price, 0);
        console.log(`Sub total =======${subTotalValue}`)
        // Calculate the tax amount based on the subtotal and tax rate
        const taxAmountValue = (subTotalValue * TaxRate) / 100;
        console.log(`Tax total =======${taxAmountValue}`)
        // Calculate the grand total by adding the subtotal and tax amount
        const grandTotalValue = subTotalValue + taxAmountValue;
        console.log(`Grand total =======${grandTotalValue}`)
        // Update the state variables with the calculated values
        setUser((prevUser) => ({
            ...prevUser,
            Subtotal: subTotalValue.toFixed(2),
            Taxamount: taxAmountValue.toFixed(2),
            GrandTotal: grandTotalValue.toFixed(2),
        }));
    };


    const fetchCustDetails = () => {



        const appdata = JSON.parse(localStorage.getItem('app-user'));
        console.log(appdata);
        const email = appdata.email;
        console.log(email); // Assuming email is stored in localStorage
        axios.post('/api/customers/get-customer', {
            email: email
        }).then((res) => {
            setUser({
                ...res.data,
                orderDateTime: defaultDateTime,
                // deliveryDateTime: moment().add(2, 'hours').startOf('hour')
            });
            console.log("user====" + user);
            calculateTotals(orderdetails);
            setLoading(false);
        })
            .catch(error => {
                console.log(error);
                message.error('Failed to fetch user data');
            });
        calculateTotals(orderdetails);
    };

    useEffect(() => {
        fetchCustDetails();
    }, []);
    useEffect(() => {
    }, [Subtotal, Taxamount, GrandTotal]);
    // useEffect(() => {
    //     // Fetch the initial form values from the form
    //     // const initialValues = form.getFieldsValue();

    //     // Calculate the totals based on the initial form values
    //     calculateTotals(orderdetails);
    // }, [form, orderdetails]);
    if (Object.keys(user).length === 0) {
        return <div>Loading...</div>;
    }
    const columns = [
        {
            title: "Name",

            dataIndex: "menu_name",
            width: 300
        },
        {
            title: "Items",
            dataIndex: "items",
            width: 350,
            render: (items) => (
                <ul>
                    {items && items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            ),
        },
        {
            title: "Unit Price",
            dataIndex: "unit_price",
            width: 100
        },
        {
            title: "Qty",
            dataIndex: "quantity",
            width: 100
        },
        {
            title: "Total Price",
            dataIndex: "total_price",
            width: 100
        }

    ];

    const sendPDFToServer = (pdfData, email) => {
        // console.log(`pdf data==${pdfData}`);
        // Send the PDF data to the server using axios
        axios
            .post('/api/order/send-order-email', { pdfData, email })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error sending PDF to server:', error);
            });
    }

    const onFinish = (values) => {
        console.log("On Finish values==", values);
        console.log(typeof values)
        values.items = orderdetails;
        values.menu = orderdetails.menu_id;
        values.customerId = user._id;
        values.quantity = orderdetails.quantity;
        values.unitPrice = orderdetails.unitPrice;
        values.totalPrice = orderdetails.totalPrice;
        // values.name = user._id;
        console.log("Final values==", values);


        axios.post('/api/order/add-order', values).then((response) => {
            // dispatch({ type: 'hideLoading' });
            message.success('Order Placed Successfully')
            dispatch({ type: 'resetState' });
            navigate('/allorder')
        }).catch((error) => {
            // dispatch({ type: 'hideLoading' });
            message.error('Something went wrong');
            console.log(error)
        })

        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        const formData = values;
        const subtotal = values.items.reduce((total, item) => total + item.total_price, 0);
        const taxpdf = (subtotal * 18) / 100;
        const grandTotal = subtotal + taxpdf;



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
                        formData.deliveryAddress && {
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
                            ...values.items.map((item) => [
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
                                { text: 'Sub Total', colSpan: 4, alignment: 'right', style: 'tableCellBold' },
                                {},
                                {},
                                {},
                                { text: subtotal.toFixed(2), style: 'tableCellBold' },
                            ],
                            [
                                { text: 'Tax', colSpan: 4, alignment: 'right', style: 'tableCellBold' },
                                {},
                                {},
                                {},
                                { text: "gst@18%", style: 'tableCellBold' },
                            ],
                            [
                                { text: 'Tax Amount', colSpan: 4, alignment: 'right', style: 'tableCellBold' },
                                {},
                                {},
                                {},
                                { text: taxpdf.toFixed(2), style: 'tableCellBold' },
                            ],
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
            info: {
                email: values.email, // Include the email address as metadata
            }
        };

        // pdfMake.createPdf(docDefinition).download('order_details.pdf');
        pdfMake.createPdf(docDefinition).getBase64((data) => {
            // Send the generated PDF data to the server
            sendPDFToServer(data, values.email);
        });



    }


    const handleOrderTypeChange = (value) => {
        setOrderType(value); // Update the orderType state
        if (value === 'Take Away') {
            form.setFieldsValue({ deliveryAddress: undefined });
        }
    };



    return (
        <DefaultLayout>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <main><section className='menu sections'>
                    <div className='title'>
                        <h2>Order Details</h2>

                    </div>
                    <div className='orderForm'>
                        <Form name="orderform" initialValues={user} onFinish={onFinish} labelAlign="left"
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

                                            style={{ textAlign: "left" }}
                                            dropdownStyle={{ textAlign: "left" }}
                                            onChange={handleOrderTypeChange}
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
                                            defaultValue={defaultDateTime}
                                            style={{ width: "100%" }}
                                            disabledDate={(current) => current && current < moment().startOf('day')}
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
                                            showTime={{ defaultValue: moment().add(2, 'hours').startOf('hour') }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            // defaultValue={defaultDateTime}
                                            style={{ width: "100%" }}
                                            disabledDate={(current) =>
                                                current && (current < moment().add(2, 'hours') || current < moment().startOf('day'))
                                            }
                                        />
                                    </Form.Item>

                                    <div style={{ marginLeft: "160px", color: "red" }}>
                                        For last minute orders, kindly call the hotel.
                                    </div>

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
                                        <Select style={{ textAlign: "left" }} onChange={(value) => setShowComments(value === 'yes')}>
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
                                    {orderType === "Delivery" && (
                                        <Form.Item
                                            label="Delivery Address"
                                            name="deliveryAddress"
                                            rules={[
                                                ({ getFieldValue }) => ({
                                                    required:
                                                        getFieldValue("orderType") === "Delivery",
                                                    message: "Please input Delivery Address!",
                                                }),
                                            ]}

                                            labelCol={{ span: 8 }} // Set the label width to 8 columns
                                            wrapperCol={{ span: 16 }} // Set the input field width to 16 columns
                                        >
                                            <Input.TextArea rows={4} />
                                        </Form.Item>
                                    )}
                                </Col>


                            </Row>
                            <Row justify="space-between" gutter={[30, 8]}>
                                {showComments && (
                                    <Col span={8}>
                                        <Form.Item
                                            label="Comments"
                                            name="comments"
                                            rules={[
                                                {
                                                    required:
                                                        true,
                                                    message: "Please input Comments!",
                                                },
                                            ]}

                                            labelCol={{ span: 8 }} // Set the label width to 8 columns
                                            wrapperCol={{ span: 16 }} // Set the input field width to 16 columns
                                        >
                                            <Input.TextArea rows={4} />
                                        </Form.Item>
                                    </Col>
                                )}
                            </Row>
                            <Table
                                columns={columns}
                                dataSource={orderdetails}
                            />
                            <Row justify="space-between" gutter={[30, 8]}>
                                <Col span={8}>
                                    <Form.Item
                                        label="Sub Total"
                                        name="Subtotal"
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                    >
                                        <InputNumber min={0} value={Subtotal} disabled style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify="space-between" gutter={[30, 8]}>
                                <Col span={8}>
                                    <Form.Item
                                        label="Tax Rate (%)"
                                        name="TaxRate"
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                    >
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            defaultValue={TaxRate}
                                            disabled style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify="space-between" gutter={[30, 8]}>
                                <Col span={8}>
                                    <Form.Item
                                        label="Tax Amount"
                                        name="Taxamount"
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                    >
                                        <InputNumber min={0} value={Taxamount} disabled style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify="space-between" gutter={[30, 8]}>
                                <Col span={8}>
                                    <Form.Item
                                        label="Grand Total"
                                        name="GrandTotal"
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                    >
                                        <InputNumber min={0} value={GrandTotal} disabled style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div className="menuselection">
                                <Button htmlType="submit" type="primary">
                                    Place Order
                                </Button>
                            </div>
                        </Form>
                    </div>
                </section></main>
            )}
        </DefaultLayout>
    );
}

export default Order;
