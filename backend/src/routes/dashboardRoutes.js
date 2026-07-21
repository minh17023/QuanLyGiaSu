const express = require('express');
const {
  getStudentFinances,
  addPayment
} = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/finances', getStudentFinances);
router.post('/payments', addPayment);

module.exports = router;
