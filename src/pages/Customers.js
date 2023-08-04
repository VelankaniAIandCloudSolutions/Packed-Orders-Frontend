import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Col, Row, Table, Button, Form, message, Input, Select, Modal, DatePicker, Space, } from 'antd';
import {
    DeleteOutlined,
    EditOutlined, MinusCircleOutlined, PlusOutlined
} from "@ant-design/icons"
import '../resources/customer.css'
import DefaultLayout from '../components/DefaultLayout';
// import { useDispatch } from 'react-redux'


function Customers() {
    const [customerCompany, setCustomerCompany] = useState('');
    const appdata = JSON.parse(localStorage.getItem('app-user'));
    const role = appdata.role;
    const email = appdata.email;
    console.log(role);
    if (role === "Customer Admin") {
        axios.post('/api/customers/get-customer', {
            email: email
        }).then((response) => {
            setCustomerCompany(response.data.company);
        })
            .catch(error => {
                console.log(error);
                message.error('Failed to fetch user data');
            });
    }
    const { Option } = Select;
    const [customersData, setCustomersData] = useState([]);
    const [addEditModalVisibility, setAddEditModalVisibility] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState(null)
    // const dispatch = useDispatch()
    const getAllCustomers = () => {
        // dispatch({ type: 'showLoading' })
        axios.get('/api/customers/get-all-customer').then((response) => {
            // dispatch({ type: 'hideLoading' })
            const allCustomers = response.data;
            let filteredCustomers = allCustomers;
            if (appdata.role === 'Customer') {
                // const loggedInCustomer = getLoggedInCustomer(); // Replace with the actual function to get the logged-in customer data
                filteredCustomers = allCustomers.filter((customer) => customer.email === appdata.email);
            }
            if (appdata.role === 'Customer Admin') {
                filteredCustomers = allCustomers.filter((customer) => customer.company === appdata.company);
            }
            setCustomersData(filteredCustomers)
        }).catch((error) => {
            // dispatch({ type: 'showLoading' })
            console.log(error)
        })
    }

    const deleteCustomer = (record) => {
        axios.post('/api/customers/delete-customer', { customerID: record._id })
            .then((response) => {
                message.success('Customer deleted Successfully')
                getAllCustomers()
            })
            .catch((error) => {
                // dispatch({ type: 'showLoading' })
                message.error('Something went wrong')
                console.log(error)
            })
    }

    const columns = [
        {
            title: 'Customer Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Phone',
            dataIndex: 'mobileno',
            key: 'mobileno',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
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
        // {
        //     title: 'Invite',
        //     dataIndex: '_id',
        //     key: 'invite',
        //     render: (id, record) => (
        //         <Button type="primary" onClick={() => deleteCustomer(record)}>
        //             Invite Customer
        //         </Button>
        //     ),
        // },
        {
            title: "Actions",
            dataIndex: "_id",
            render: (id, record) => (
                < div className="d-flex" >
                    <EditOutlined className='mx-2' onClick={() => {
                        setEditingCustomer(record)
                        setAddEditModalVisibility(true)
                    }} /><span>  </span>
                    <DeleteOutlined className="mx-2" onClick={() => deleteCustomer(record)} />

                </div >
            )
        },

    ];


    useEffect(() => {
        getAllCustomers()
    }, []);

    const onFinish = (values) => {
        const userValues = {
            email: values.email,
            name: values.name,
            password: "Oterra@123",
            role: values.role,
            company: values.company
        };
        // dispatch({ type: "showLoading" });
        if (editingCustomer === null) {
            axios.post('/api/customers/add-customer', values).then((response) => {
                // dispatch({ type: 'hideLoading' });
                console.log(values.email);
                message.success('Customer Added Successfully')
                setAddEditModalVisibility(false)
                getAllCustomers()


                // post data to users
                axios.post('/api/users/add-user', userValues).then((response) => {
                    // Handle the successful response
                    console.log('User data posted successfully:', response.data);
                })
                    .catch((error) => {
                        // Handle errors for the users endpoint
                        console.log('Failed to post user data:', error);
                    });
            }).catch((error) => {
                // dispatch({ type: 'hideLoading' });
                message.error('Something went wrong');
                console.log(error)
            })


        }
        else {
            axios
                .post('/api/customers/edit-customer', { ...values, customerID: editingCustomer._id })
                .then((response) => {
                    console.log(values)
                    // dispatch({ type: 'hideLoading' })
                    message.success('Customer Edited Successfully')
                    setEditingCustomer(null)
                    setAddEditModalVisibility(false)
                    getAllCustomers()
                })
                .catch((error) => {
                    // dispatch({ type: 'hideLoading' })
                    message.error('Something went wrong')
                    console.log(error)
                })
        }
    }

    return (
        <DefaultLayout>
            <div className="d-flex justify-content-between align-items-center test">

                <h2 className="hclass">Customers</h2>
                <Button type="primary" onClick={() => setAddEditModalVisibility(true)} className="customer-button">Add Customer</Button>
            </div>
            <Table columns={columns} dataSource={customersData} bordered />
            {addEditModalVisibility && (
                <Modal onCancel={() => {
                    setEditingCustomer(null)
                    setAddEditModalVisibility(false)
                }} visible={addEditModalVisibility} title={`${editingCustomer !== null ? 'Edit Customer' : 'Add New Customer'}`} footer={false}>

                    <Form initialValues={editingCustomer} layout="vertical" onFinish={onFinish}  >
                        <Form.Item name='name' label='Name' rules={[{ required: true }]} >
                            <Input />
                        </Form.Item>
                        <Form.Item name='mobileno' label='Phone' rules={[{ required: true }]} >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name='email'
                            label="Email"
                            rules={[
                                {
                                    type: 'email',
                                    required: true
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name='company' label='Company' rules={[{ required: true }]}
                            initialValue={role === 'Customer Admin' && !editingCustomer ? customerCompany : undefined}
                        >
                            <Input disabled={role === 'Customer Admin'} />
                        </Form.Item>
                        <Form.Item name='gstno' label='GSTIN No' rules={[{ required: true }]} >
                            <Input />
                        </Form.Item>
                        <Form.Item name='address' label="Address" rules={[{ required: true }]}>
                            <Input.TextArea showCount maxLength={400} />
                        </Form.Item>
                        <Form.Item label="Role" name="role" rules={[{ required: true, message: "Please select the Role!", }]}>
                            <Select

                                style={{ textAlign: "left" }}
                                dropdownStyle={{ textAlign: "left" }}
                                disabled={role === 'Customer Admin'} // Disable if userRole is "customer admin"
                                defaultValue={role === 'Customer Admin' ? 'Customer' : undefined} // Set default value to "Customer" for "customer admin" role

                            >
                                <Option value="Customer">Customer</Option>
                                <Option value="Customer Admin">Customer Admin</Option>
                            </Select>
                        </Form.Item>
                        <div className="d-flex justify-content-end">
                            <Button htmlType="submit" type="primary">
                                SAVE
                            </Button>
                        </div>

                    </Form>
                </Modal>
            )
            }
        </DefaultLayout>
    )
}

export default Customers
