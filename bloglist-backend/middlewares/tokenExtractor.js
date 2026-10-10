const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    const error = new Error('token missing');
    error.status = 401;
    return next(error);
  }

  try {
    req.decodedToken = jwt.verify(authorization.slice(7), SECRET);
    return next();
  } catch (err) {
    err.status = 401;
    return next(err);
  }
};

module.exports = tokenExtractor;
