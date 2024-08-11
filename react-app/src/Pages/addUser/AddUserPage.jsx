import {Link, NavLink, Outlet} from "react-router-dom";
import React, {useEffect,useState} from 'react';
import axios from "axios";


const AddUserPage = () => {

    const [testInput, setTestInput] = useState("")
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    async function adduser (login,password) {
        try {
            console.log('go resp')
            const response = await axios.post(`http://127.0.0.1:8443/api/user/addUser`, {
                login,
                password
            })
            if (response.data)
            {
                console.log(response.data)
            }
            console.log(response.data)
        } catch (e) {
            //alert(e)
            console.log(e.response.data)
        }
    }
    return(
        <div className="MainPage animate__animated animate__fadeIn">
            <div className="navigationSecond">

                <input
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    type="text"
                    placeholder="ЛОГИН"
                />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="text"
                    placeholder="ПАРОЛЬ"
                />
                <button onClick={() => {
                    adduser(login, password)
                }} className="Buy_btn">Фильтр
                </button>

            </div>
        </div>


    )
}
export {AddUserPage};