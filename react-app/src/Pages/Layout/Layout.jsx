import {NavLink, Link, Outlet, Route} from "react-router-dom";
import React, {useState} from 'react';
import axios from 'axios'
import {useDispatch} from "react-redux";

const Layout = () => {

    return(
        <div>
            <main>
                <div className={"content"}>
                    11111
                    <NavLink className="HeaderNav" to="/">
                        <div id='logo'>
                            MAIN
                        </div>
                    </NavLink>
                    <NavLink className="HeaderNav" to="AddProduct">
                        <div id='logo'>
                            AddProduct
                        </div>
                    </NavLink>
                    <NavLink className="HeaderNav" to="AddUser">
                        <div id='logo'>
                            AddUser
                        </div>
                    </NavLink>
                    <NavLink className="HeaderNav" to="AllProduct">
                        <div id='logo'>
                            AllProduct
                        </div>
                    </NavLink>
                    <NavLink className="HeaderNav" to="AllUsers">
                        <div id='logo'>
                            AllUsers
                        </div>
                    </NavLink>

                    <Outlet/>
                </div>
            </main>
        </div>

    )
}
export {Layout};