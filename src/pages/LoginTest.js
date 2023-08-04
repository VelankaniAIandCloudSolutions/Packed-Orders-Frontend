import React, { useEffect } from 'react'
import { Form, Input, Button, Checkbox, Row, message } from 'antd';
import '../resources/LoginTest.css'
import logo from "../resources/logo.jpg"
import { json, Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import axios from 'axios';


function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onFinish = (values) => {
        // const values = { "password": "123", "email": "soniya.h@velankanigroup.com" };
        console.log(values);
        axios.post('/api/users/login', values).then((res) => {

            message.success("Login Successful")
            // console.log(`$(JSON.stringify(res.data))`);
            localStorage.setItem('app-user', JSON.stringify(res.data))

            // const appdata = JSON.parse(localStorage.getItem('app-user'));
            // console.log(appdata);

            dispatch({ type: 'resetState' });
            navigate('/menu')

        }).catch(() => {
            message.error("Something went wrong")
        })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    // useEffect(() => {
    //     if (localStorage.getItem('app-user'))
    //         navigate('/menu')
    // }, [])

    return (
        <div className="cover">
            <div className="form-container">
                <img src={logo} alt="logo" className="logo" />
                <h3>LOGIN</h3>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className="login-form"
                >
                    <Form.Item
                        name="email"
                        label="Email ID"
                        rules={[{ required: true, message: 'Please input your Email ID!' }]}
                    >
                        <Input type="email" placeholder="Enter your email" />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        className="Check"
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Login

