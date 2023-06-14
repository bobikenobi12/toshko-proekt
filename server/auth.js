const express = require('express');
const cors = require('cors');


const { readUser, createUser } = require('./mongooseUtils.js');
const { generateAccessToken, generateRefreshToken, removeRefreshToken } = require('./jwtUtils.js');
const bcrypt = require('bcrypt');

const router = express.Router();
router.use(express.json());
router.use(cors());



router.get('/', (req, res) => {
    res.send('auth home');
}
);

router.post('/login', (req, res) => {
    // parse req to json
    const { username, password } = req.body;
    if (username == null || password == null) {
        res.status(400).send('Missing email or password');
        return;
    }
    readUser(username).then((user) => {
        if (user) {
            // user found
            console.log(user);
            const refreshToken = generateRefreshToken({ username });
            const token = generateAccessToken(refreshToken);

            bcrypt.compare(password, user.password).then((result) => {
                if (result) {
                    // password match
                    console.log('User logged in');
                    delete user.password;
                    res.json({ token, refreshToken, user });
                }
                else {
                    // password mismatch
                    console.log('Wrong password');
                    res.status(401).send('Wrong password');
                }
            }).catch((error) => {
                console.error('Error comparing passwords:', error);
                res.status(500).send('Error comparing passwords');
            });
        } else {
            // user not found
            console.log('User not found');
            res.status(404).send('User not found');
        }
    }).catch((error) => {
        console.error('Error reading user:', error);
        res.status(500).send('Error reading user');
    });
    // check if user exists
}
);

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (username == null || password == null) {
        res.status(400).send('Missing name or password');
        return;
    }
    readUser(username).then((user) => {
        if (user) {
            // user already exists
            console.log('User already exists');
            res.status(409).send({ message: 'User already exists' });
        } else {
            // user does not exist
            try {
                createUser(username, password).then((user) => {
                    if (!user) {
                        res.status(500).send({ message: 'Error creating user' });
                        return;
                    }

                    refreshToken = generateRefreshToken({ username });
                    token = generateAccessToken(refreshToken);

                    console.log('User created');
                    delete user.password;
                    res.json({ token, refreshToken, user });
                }
                );
            }
            catch (error) {
                console.error('Error creating user:', error);

                res.status(500).send({ message: 'Error creating user' });
            }
        }
    }).catch((error) => {
        console.error('Error reading user:', error);
        res.status(500).send({ message: 'Error reading user' });
    });
}
);

router.post('/logout', (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken == null) {
        res.status(400).send({ message: 'Missing refreshToken' });
        console.log('Missing refreshToken');
        return;
    }
    removeRefreshToken(refreshToken)
    res.status(200).send({ message: 'User logged out' });
}
);


module.exports = router;