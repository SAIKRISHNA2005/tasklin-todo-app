const express = require('express');
const router = express.Router();

// GET /api/v1/health
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ok'
  });
});

module.exports = router;
