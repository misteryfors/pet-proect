const Router = require('express');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const {check, validationResult} = require('express-validator');
const router = new Router();
const db = require('../db_connect'); // Импортируем подключение к базе данных




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

router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;

        // Запрос пользователя по логину
        const query = "SELECT * FROM users WHERE Login=?";
        db.get(query, [login], async (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Ошибка при получении данных из базы', error: err.message });
            }

            if (!user) {
                // Если пользователь с таким логином не найден
                return res.status(401).json({ message: 'Неверный логин или пароль' });
            }

            // Сравнение пароля
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                // Если пароль не совпадает
                return res.status(401).json({ message: 'Неверный логин или пароль' });
            }

            // Успешная аутентификация
            console.log('Успешный вход:', user);
            return res.json({ message: 'Успешный вход', user });
        });
    } catch (e) {
        return res.status(500).json({ message: 'Внутренняя ошибка сервера', error: e.message });
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


module.exports = router;
