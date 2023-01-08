const crypto = require('crypto');

module.exports = genCryptoHash = (token) => {
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
}
