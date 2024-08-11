import React, { useState } from 'react';
import axios from 'axios';

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        // Отображение превью изображения
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('image', image);

        try {
            const response = await axios.post('http://127.0.0.1:8443/api/product/addProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Ошибка при добавлении продукта:', error);
        }
    };

    return (
        <div>
            <h1>Добавить продукт</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="number" placeholder="Количество" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                <input type="number" placeholder="Цена" value={price} onChange={(e) => setPrice(e.target.value)} />
                <input type="file" onChange={handleImageChange} />
                {preview && <img src={preview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />}
                <button type="submit">Добавить продукт</button>
            </form>
        </div>
    );
};

export { AddProductPage };
