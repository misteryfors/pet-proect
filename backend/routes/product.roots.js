const Router = require('express');
const {check, validationResult} = require('express-validator');
const router = new Router();
const db = require('../db_connect'); // Импортируем подключение к базе данных
const multer = require('multer');
const fs = require('fs');
const path=require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(__dirname)
        const uploadPath = path.join(__dirname, '..', 'imgs');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // уникальное имя файла
    }
});

const upload = multer({ storage: storage });


router.delete('/deleteProduct/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // Найдем продукт, чтобы удалить его изображение из папки
        db.get("SELECT images FROM vape_liquids WHERE id = ?", [productId], (err, row) => {
            if (err) {
                return res.status(500).json({ message: 'Ошибка при поиске продукта', error: err.message });
            }
            if (row && row.images) {
                // Путь к изображению
                const imagePath = path.join(__dirname, '../imgs', row.images);
                // Удаляем файл изображения
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Ошибка при удалении файла изображения:', err);
                    }
                });
            }

            // Удаление продукта из базы данных
            db.run("DELETE FROM vape_liquids WHERE id = ?", [productId], function (err) {
                if (err) {
                    return res.status(500).json({ message: 'Ошибка при удалении продукта из базы', error: err.message });
                }

                return res.json({ message: 'Продукт успешно удален' });
            });
        });
    } catch (e) {
        console.error('Ошибка при удалении продукта:', e);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

router.get('/allProduct', async (req, res) => {
    try {
        const name = req.query.name || ''; // Получаем фильтр из параметров запроса
        const description = req.query.description || ''; // Получаем фильтр из параметров запроса
        const minPrice = req.query.minPrice || 0; // Получаем фильтр из параметров запроса
        const maxPrice = req.query.maxPrice || 99999; // Получаем фильтр из параметров запроса
        const query = `SELECT * FROM vape_liquids WHERE name LIKE ? AND description LIKE ? AND price BETWEEN  ? AND ?`;
        const params =[`%${name}%`,`%${description}%`,minPrice,maxPrice]
        db.all(query, params, (err, rows) => {
            if (err) {
                return res.status(500).json({ message: 'Ошибка при получении данных из базы', error: err.message });
            }
            console.log(rows);
            return res.json(rows);
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

router.post('/addProduct', upload.single('image'), async (req, res) => {
    try {
        const { name, description, quantity, price } = req.body;
        const imagePath = req.file.filename; // получаем имя файла

        db.run(
            "INSERT INTO vape_liquids (name, description, quantity, price, images) VALUES (?, ?, ?, ?, ?)",
            [name, description, quantity, price, imagePath],
            function (err) {
                if (err) {
                    return res.status(500).json({ message: 'Ошибка при добавлении товара в базу', error: err.message });
                }

                return res.json({ id: this.lastID, name, description, quantity, price, image: imagePath });
            }
        );
    } catch (e) {
        console.error('Ошибка при добавлении товара:', e);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

module.exports = router;
