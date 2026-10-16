const router = require('express').Router();
const tokenExtractor = require('../middlewares/tokenExtractor');
const { Session } = require('../models');

router.delete('/', tokenExtractor, async (req, res, next) => {
  try {
    await Session.destroy({
      where: { user_id: req.decodedToken.id },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
