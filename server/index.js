const express = require('express');
const cors = require('cors');

const { authenticateToken, generateAccessToken, getUsernameFromAccessToken } = require('./jwtUtils');

const { readUser, updateUser } = require('./mongooseUtils');

const authRouter = require('./auth');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth', authRouter);


app.post('/refreshAccessToken', (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken == null) {
        return res.sendStatus(401).json({ message: 'No refresh token' });
    }
    accessToken = generateAccessToken(refreshToken);
    if (accessToken == null) {
        return res.sendStatus(403).json({ message: 'Invalid refresh token' });
    }
    res.json({ accessToken });
}
);

app.get("/getHighScore", authenticateToken, (req, res) => {
    const username = getUsernameFromAccessToken(req.headers['authorization']);

    if (username == null) {
        return res.sendStatus(400).json({ message: 'Missing username' });
    }
    readUser(username).then((user) => {
        if (user) {
            // user found
            return res.json({ highScore: user.highScore });
        }
        else {
            // user not found
            return res.status(404).send({ message: 'User not found' });
        }
    }).catch((error) => {
        console.error('Error reading user:', error);
        return res.status(500).send({ message: 'Error reading user' });
    });
}
);

app.post("/submitScore", authenticateToken, (req, res) => {
    const username = getUsernameFromAccessToken(req.headers['authorization']);
    const { score } = req.body;
    if (username == null || score == null) {
        return res.sendStatus(400).json({ message: 'Missing username or score' });
    }
    readUser(username).then((user) => {
        if (user) {
            // user found
            if (score > user.highScore) {
                // update high score
                user.highScore = score;
                updateUser(user).then((result) => {
                    if (result) {
                        // user updated
                        return res.sendStatus(200);
                    }
                    else {
                        // user not updated
                        return res.sendStatus(500);
                    }
                }).catch((error) => {
                    console.error('Error updating user:', error);
                    return res.status(500).send({ message: 'Error updating user' });
                });
            }
            else {
                // score not high enough
                return res.sendStatus(200);
            }
        }
        else {
            // user not found
            return res.sendStatus(404);
        }
    }).catch((error) => {
        console.error('Error reading user:', error);
        return res.status(500).send({ message: 'Error reading user' });
    });
}
);

app.listen(3000, () => {
    console.log('App listening on localhost:3000');
}
);

