const jwt = require('jsonwebtoken');

const secretKey = 'your-secret-key';

refreshTokens = [];
refreshTokensToUsername = {};

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'No access token' });
    }


    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid access token' });
        }
        req.user = user;
        next();
    });
}

function generateAccessToken(refreshToken) {
    if (!refreshTokens.includes(refreshToken)) {
        return null;
    }

    const username = refreshTokensToUsername[refreshToken];

    const accessToken = jwt.sign(username, secretKey, { expiresIn: '1m' });
    return accessToken;
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

function getUsernameFromAccessToken(accessToken) {
    const token = accessToken.split(' ')[1];
    return jwt.verify(token, secretKey).username;
}

module.exports = {
    authenticateToken,
    generateAccessToken,
    generateRefreshToken,
    removeRefreshToken,
    getUsernameFromAccessToken
};