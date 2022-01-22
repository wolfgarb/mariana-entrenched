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
  },
  // middleware function to verify JWT
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // seperate 'bearer' from 'tokenvalue'
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // if not token, return request object as is
    if (!token) {
      return req;
    }

    // we dont want to throw an err on every req
    // the TRY method will still return the user/thought data
    try {
      // decode and attach user data to req object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      // this will catch the auth error on the resolver side instead of client side!
      // that way they can still see the posts.
    } catch {
      console.log('invalid token');
    }

    // return updated req object
    return req;
  }
};
