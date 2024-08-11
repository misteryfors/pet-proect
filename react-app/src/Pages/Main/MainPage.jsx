import {Link, NavLink, Outlet} from "react-router-dom";
import React, {useEffect,useState} from 'react';


const MainPage = () => {


    return(
        <div className="MainPage animate__animated animate__fadeIn">
            <div className="FullScreen">
            </div>
            <title>Главная</title>

            <meta name="description" content="111На нашем сайте мы предоставляем услуги
                        по сервисному обслуживанию гарантийному и после гарантийный
                        Стиральных машин
                        Холодильников
                        Кофемашин
                        Посудомоечные машины
                        Варочные панели
                        И продаже
                        Холодильников
                        Стиральных машин
                        Варачных панелей
                        Духовые шкафы"/>
            <div className="main-info" id="yakor">
            </div>
            <div className="navigationSecond">

                <div className="sections">
                    <div  >

                        <div className="block-link-info">

                            <h3>Заказать ремонт техники</h3>
                            <p>У нас вы можете заказть ремонт техники.
                                <br></br>Просто заполните форму.</p>


                        </div>

                    </div>

                    <div >

                        <div className="block-link-info">
                            <h3>Узнать о нас</h3>
                            <p> Вы можете почитать о нас.
                                <br></br>На отдельной странице.</p>


                        </div>


                    </div>

                    <div >

                        <div className="block-link-info">
                            <h3>Аккаунт</h3>
                            <p> Вы можете создать аккаунт!
                                <br></br>Переписывайтесь с мастером на сайте.</p>


                        </div>


                    </div>
                </div>

            </div>
        </div>


    )
}
export {MainPage};