const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const apiRoutes = require('./routes/apiRoutes');

//database connection
const db = require('./data/database.js');

const app = express();
const PORT = 3000;

//Middleware Setup
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Session middleware
app.use(session({
    secret: 'a-very-long-and-random-secret-key-for-health-mate',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

//API Routes
app.use('/api', apiRoutes);

//Registration Endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
        db.run(sql, [username, email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ message: 'Username or email already exists.' });
                }
                return res.status(500).json({ message: 'Database error during registration.' });
            }
            res.status(201).json({ message: 'Registration successful! You can now log in.' });
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred on the server.' });
    }
});

//Login Endpoint
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const sql = `SELECT * FROM users WHERE username = ?`;

        db.get(sql, [username], async (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Database error during login.' });
            }
            if (!user) {
                return res.status(400).json({ message: 'Invalid username or password.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid username or password.' });
            }

            req.session.user = { username: user.username, email: user.email };
            res.status(200).json({ message: 'Login successful!' });
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred on the server.' });
    }
});

app.get('/api/session', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ loggedIn: true, user: req.session.user });
    } else {
        res.status(200).json({ loggedIn: false });
    }
});

app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/login.html');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
