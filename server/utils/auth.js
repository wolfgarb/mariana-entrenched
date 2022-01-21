const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
    // this function will add the users username, email and _id to the token
    // the secret and expiry are optional.
    // the secret merely enables the server to verify whether or not
    // the JWT is recognized
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }
};
