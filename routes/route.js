
const express = require('express');

const loginController = require('../controllers/login')

const router = express.Router();

router.get('/', loginController.getRoot);
router.post('/logout', loginController.logout);
router.post('/login', loginController.login);
router.post('/register', loginController.register);

router.get('/job', loginController.job);
router.get('/del', loginController.del);
router.post('/save_time', loginController.save_time);


module.exports = router;
