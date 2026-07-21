const express = require('express');
const { getAllClasses, createClass, updateClass, deleteClass } = require('../controllers/classController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/', getAllClasses);
router.post('/', createClass);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);

module.exports = router;
