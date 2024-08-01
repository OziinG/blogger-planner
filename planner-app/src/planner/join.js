import React, { useState } from 'react';
import axios from 'axios';
import "./css/join.css"
import { useNavigate } from "react-router-dom";



const Join = () => {

    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        password: '',
        passwordConfirm: '',
        name: '',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.password !== form.passwordConfirm) {
            alert("Passwords do not match");
            return;
        }

        const joinDto = {
            username: form.username,
            password: form.password,
            name: form.name,
            email: form.email
        };
        console.log(joinDto);
        axios.post('http://localhost:8080/joinProc', joinDto, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        .then(res => {
            
            alert('회원가입 성공');
            navigate('/login');
        })
        .catch(error => {
            console.error('There was an error!', error);
            alert('회원가입 실패');

        });
    };

    return (
        <div className="container" style={{ marginTop: '80px' }}>
            <h2>Create Your Account</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" placeholder="Enter your username" required value={form.username} onChange={handleChange} />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" required value={form.password} onChange={handleChange} />
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input type="password" id="passwordConfirm" name="passwordConfirm" placeholder="Confirm your password" required value={form.passwordConfirm} onChange={handleChange} />
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Enter your name" required value={form.name} onChange={handleChange} />
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required value={form.email} onChange={handleChange} />
                <input type="submit" value="Sign Up" />
            </form>
        </div>
    );
};

export default Join;
