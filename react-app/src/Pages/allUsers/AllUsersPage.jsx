import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllUsersPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const response = await axios.get('http://127.0.0.1:8443/api/user/allUsers');
            if (response.data) {

                setUsers(response.data);
                console.error(response.data);
            }
        } catch (e) {
            console.error('Ошибка при загрузке пользователей:', e);
        }
    }

    return (
        <div className="MainPage animate__animated animate__fadeIn">
            <div className="FullScreen">
                <h1>Все пользователи</h1>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Логин</th>
                        <th>Пароль (расшифрованный)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.login}</td>
                            <td>{user.password}</td> {/* Выводим расшифрованный пароль */}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export { AllUsersPage };
