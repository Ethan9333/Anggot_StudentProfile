const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-activity-7';

app.use(cors());
app.use(express.json({ limit: '10mb' }));


const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database connection failed:', err.message);
    else console.log('Connected to SQLite database.');
});


db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            fullname TEXT NOT NULL,
            course TEXT NOT NULL,
            year_level TEXT NOT NULL,
            about TEXT,
            skills TEXT,
            avatar TEXT
        )
    `, async () => {

        db.get(`SELECT * FROM students WHERE student_id = ?`, ['20210001'], async (err, row) => {
            if (!row) {
                const hashedPassword = await bcrypt.hash('password123', 10);
                const defaultAvatar = "img/avatar.png";
                db.run(`
                    INSERT INTO students (student_id, password, fullname, course, year_level, about, skills, avatar)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    '20210001',
                    hashedPassword,
                    'Ethan Kyle Anggot',
                    'BS Information Technology',
                    '3rd Year',
                    'Passionate IT student specializing in web and mobile app development.',
                    'JavaScript, HTML/CSS, Cordova, Git',
                    defaultAvatar
                ], () => console.log('Default test student (20210001 / password123) created.'));
            }
        });
    });
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
}


app.post('/api/register', async (req, res) => {
    const { student_id, password, fullname, course, year_level, about, skills } = req.body;
    if (!student_id || !password || !fullname || !course || !year_level) {
        return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO students (student_id, password, fullname, course, year_level, about, skills, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(query, [student_id, hashedPassword, fullname, course, year_level, about || '', skills || '', 'img/avatar.png'], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ message: 'Student ID already exists.' });
                }
                return res.status(500).json({ message: 'Failed to create student account.' });
            }
            res.status(201).json({ message: 'Student registered successfully', id: this.lastID });
        });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/api/login', (req, res) => {
    const { student_id, password } = req.body;
    if (!student_id || !password) {
        return res.status(400).json({ message: 'Student ID and password are required.' });
    }

    db.get(`SELECT * FROM students WHERE student_id = ?`, [student_id], async (err, student) => {
        if (err || !student) {
            return res.status(401).json({ message: 'Invalid student ID or password.' });
        }

        const validPassword = await bcrypt.compare(password, student.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid student ID or password.' });
        }

        const token = jwt.sign({ id: student.id, student_id: student.student_id }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, student_id: student.student_id });
    });
});

app.get('/api/profile', authenticateToken, (req, res) => {
    db.get(`SELECT id, student_id, fullname, course, year_level, about, skills, avatar FROM students WHERE id = ?`, [req.user.id], (err, row) => {
        if (err || !row) return res.status(404).json({ message: 'Unable to retrieve profile.' });
        res.json(row);
    });
});


app.put('/api/profile', authenticateToken, (req, res) => {
    const { fullname, course, year_level, about, skills, avatar } = req.body;

    if (!fullname || !course || !year_level) {
        return res.status(400).json({ message: 'Name, course, and year level are required.' });
    }

    const query = `
        UPDATE students
        SET fullname = ?, course = ?, year_level = ?, about = ?, skills = ?, avatar = COALESCE(?, avatar)
        WHERE id = ?
    `;

    db.run(query, [fullname, course, year_level, about, skills, avatar, req.user.id], function (err) {
        if (err) return res.status(500).json({ message: 'Unable to update profile.' });
        res.json({ message: 'Profile updated successfully.' });
    });
});


app.delete('/api/profile/test-record', authenticateToken, (req, res) => {
    db.run(`DELETE FROM students WHERE student_id LIKE 'TEST%'`, function (err) {
        if (err) return res.status(500).json({ message: 'Failed to delete test records.' });
        res.json({ message: `Deleted test records successfully. (${this.changes} row(s) removed)` });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});