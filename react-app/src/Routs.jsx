import React, {useEffect} from 'react'
import {Route, Routes, Navigate} from "react-router-dom";
import {AddProductPage} from "./Pages/addProduct/AddProductPage";
import {MainPage} from "./Pages/Main/MainPage";
import {Layout} from "./Pages/Layout/Layout";
import {AllProductPage} from "./Pages/allProducts/AllProductPage";
import {AllUsersPage} from "./Pages/allUsers/AllUsersPage";
import {AddUserPage} from "./Pages/addUser/AddUserPage";



export default function Routs(){





    return(
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path="main" element={<MainPage/>}/>
                <Route index element={<MainPage/>}/>
                <Route path="AddProduct" element={<AddProductPage/>}/>
                <Route path="AddUser" element={<AddUserPage/>}/>
                <Route path="AllProduct" element={<AllProductPage/>}/>
                <Route path="AllUsers" element={<AllUsersPage/>}/>
                <Route path="confirm/:id" element={<MainPage/>}/>
                <Route path="*" element={<MainPage/>}/>
            </Route>
        </Routes>
    )
}