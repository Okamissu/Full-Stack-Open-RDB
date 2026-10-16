const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const { Session, User } = require('../models');

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    const error = new Error('token missing');
    error.status = 401;
    return next(error);
  }

  const sid = authorization.slice(7); // Extract the session ID from the token
  if (!sid) {
    const error = new Error('Session ID missing in token');
    error.status = 401;
    return next(error);
  }

  try {
    req.decodedToken = jwt.verify(sid, SECRET);

    const session = await Session.findOne({
      where: { sid },
      include: {
        model: User,
        where: { disabled: false },
      },
    });

    if (!session) {
      const error = new Error('Invalid session');
      error.status = 401;
      return next(error);
    }

    return next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      err.status = 401;
    }
    return next(err);
  }
};

module.exports = tokenExtractor;
