import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllProductPage = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {

            const response = await axios.get(`http://127.0.0.1:8443/api/test/allProduct?name=${name}&description=${description}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
            if (response.data) {
                setProducts(response.data);
            }
        } catch (e) {
            console.error('Ошибка при загрузке продуктов:', e);
        }
    }

    async function deleteProduct(productId) {
        try {
            await axios.delete(`http://127.0.0.1:8443/api/product/deleteProduct/${productId}`);
            // После удаления обновляем список продуктов
            fetchProducts();
        } catch (e) {
            console.error('Ошибка при удалении продукта:', e);
        }
    }

    return (
        <div className="MainPage animate__animated animate__fadeIn">
            <div className="FullScreen">
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Фильтр"/>
                <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" placeholder="Фильтр"/>
                <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} type="text" placeholder="Фильтр"/>
                <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} type="text" placeholder="Фильтр"/>
                <button onClick={() => fetchProducts()}>Удалить</button>
                <h1>Все продукты</h1>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Описание</th>
                        <th>Количество</th>
                        <th>Цена</th>
                        <th>Изображение</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.quantity}</td>
                            <td>{product.price}</td>
                            <td>
                                {product.images ? (
                                    <img
                                        src={`http://127.0.0.1:8443/${product.images}`}
                                        alt={product.name}
                                        style={{width: '100px', height: '100px', objectFit: 'cover'}}
                                    />
                                ) : (
                                    'Нет изображения'
                                )}
                            </td>
                            <td>
                                <button onClick={() => deleteProduct(product.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export {AllProductPage};
