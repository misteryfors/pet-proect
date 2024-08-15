import React, { useState } from 'react';
import axios from 'axios';
import {useDispatch} from "react-redux";
import {loginSuccess} from "../../Reducer/UserReducer/UserReducer";

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch()
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('login', login);
        formData.append('password', password);

        try {
            const response = await axios.post(`http://127.0.0.1:8443/api/user/login`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            dispatch(loginSuccess(response.data.user));
            console.log('Успешный вход:', response.data);
            // Дальнейшие действия после успешного входа
        } catch (error) {
            console.error('Ошибка входа:', error);
            // Обработка ошибки входа
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    value={login}
                    onChange={event => setLogin(event.target.value)}
                    type="text"
                    placeholder="Login"
                    required
                />
                <input
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    type="password" // тип должен быть "password"
                    placeholder="Password"
                    required
                />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export { LoginPage };
