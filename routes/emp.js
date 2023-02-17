const express = require('express');

const router = express.Router();

const emp_Controller = require('../controllers/emp')

router.get('/', emp_Controller.getEmp)

module.exports = router;
