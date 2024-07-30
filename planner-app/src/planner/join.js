import React, { useState } from 'react';
import axios from 'axios';

const Join = () => {
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
        axios.post('/joinProc', form)
            .then(response => {
                alert('회원가입 성공');
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    return (
        <div className="container">
            <h2>Create Your Account</h2>
            <form onSubmit={handleSubmit}>
                <input type="hidden" name="_csrf" value={document.querySelector('meta[name="_csrf"]').content} />
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
