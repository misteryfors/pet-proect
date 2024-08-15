// routes/test.routes.js
const Router = require('express');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
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

router.post('/test', async (req, res) => {
    try {
        console.log('aaa');
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({message: 'Некорректный запрос', errors});
        }

        const {test} = req.body;
        console.log(test);

        // Здесь можно использовать `db` для выполнения SQL-запросов
        db.run("INSERT INTO tests (test_value) VALUES (?)", [test], function(err) {
            if (err) {
                return res.status(500).json({message: 'Ошибка при добавлении данных в базу', error: err.message});
            }
            return res.json({id: this.lastID, test: test});
        });

    } catch (e) {
        console.log(e);
    }
});
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
router.get('/allUsers', async (req, res) => {
    try {
        // Получаем всех пользователей из базы данных
        db.all("SELECT id, Login, password FROM users", [], (err, rows) => {
            if (err) {
                return res.status(500).json({ message: 'Ошибка при получении данных из базы', error: err.message });
            }

            // Обход всех пользователей и расшифровка паролей
            const users = rows.map(row => ({
                id: row.id,
                login: row.login,
                decrypted_password: row.password // Оставляем зашифрованный пароль
            }));

            return res.json(users);
        });
    } catch (e) {
        return res.status(500).json({ message: 'Внутренняя ошибка сервера', error: e.message });
    }
});

module.exports = router;

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

router.post(
    '/addUser',
    [
        check('login', 'Имя пользователя не может быть пустым').notEmpty(),
        check('password', 'Пароль должен быть длиной минимум 6 символов').isLength({ min: 6 }),
    ],
    async (req, res) => {
        try {
            console.log('Добавление пользователя');
            console.log(req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Некорректный запрос', errors: errors.array() });
            }

            const { login, password } = req.body;
            // Хэшируем пароль перед сохранением в базу данных
            const hashedPassword = await bcrypt.hash(password, 8);
            // Проверяем, существует ли уже пользователь с таким email
            db.get("SELECT * FROM users WHERE Login = ?", [login], (err, user) => {
                if (err) {
                    return res.status(500).json({ message: 'Ошибка при проверке пользователя в базе', error: err.message });
                }

                if (user) {
                    return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
                }
                // Вставляем нового пользователя в базу данных
                db.run(
                    "INSERT INTO users (Login, password) VALUES ( ?, ?)",
                    [login, hashedPassword],
                    function (err) {
                        if (err) {
                            return res.status(500).json({ message: 'Ошибка при добавлении пользователя в базу', error: err.message });
                        }

                        return res.json({ id: this.lastID, login: login });
                    }
                );
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
        }
    }
);

router.post('/confirm', async (req, res) => {
    try {
        console.log(req.body);
        console.log('1');
        const {id} = req.body;
        console.log(id);
        console.log(config.get('secretKey'));
        console.log('2');
        let id1 = jwt.verify(id, config.get('secretKey'));
        console.log(id1);
        console.log('3');

        // Используем `db` для поиска пользователя
        db.get("SELECT * FROM users WHERE id = ?", [id1.id], (err, candidate) => {
            if (err || !candidate) {
                return res.status(400).json({message: "Срок действия ссылки истёк или пользователь не найден"});
            }

            if (candidate.confirmed) {
                return res.json({
                    token: id,
                    user: {
                        id: candidate.id,
                        email: candidate.email,
                        role: candidate.role,
                        avatar: candidate.avatar
                    }
                });
            } else {
                // Обновляем статус подтверждения пользователя
                db.run("UPDATE users SET confirmed = ? WHERE id = ?", [true, candidate.id], function(err) {
                    if (err) {
                        return res.status(500).json({message: 'Ошибка при обновлении пользователя', error: err.message});
                    }

                    console.log(candidate);
                    console.log(id);
                    return res.json({
                        token: id,
                        user: {
                            id: candidate.id,
                            email: candidate.email,
                            role: candidate.role,
                            avatar: candidate.avatar
                        }
                    });
                });
            }
        });

    } catch (e) {
        console.log(e);
        return res.status(400).json({message: "Срок действия ссылки истёк"});
    }
});

module.exports = router;
