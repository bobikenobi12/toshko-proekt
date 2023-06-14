const jwt = require('jsonwebtoken');

const secretKey = 'your-secret-key';

refreshTokens = [];
refreshTokensToUsername = {};

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

function generateAccessToken(refreshToken) {
    if (!refreshTokens.includes(refreshToken)) {
        return null;
    }

    return jwt.sign(refreshTokensToUsername[refreshToken], secretKey, { expiresIn: '1m' });
}

function generateRefreshToken(username) {
    token = jwt.sign(username, secretKey);
    refreshTokens.push(token);
    refreshTokensToUsername[token] = username;
    return token;
}

function removeRefreshToken(token) {
    refreshTokens = refreshTokens.filter(t => t !== token);
    delete refreshTokensToUsername[token];
    return true;
}

module.exports = {
    authenticateToken,
    generateAccessToken,
    generateRefreshToken,
    removeRefreshToken
};