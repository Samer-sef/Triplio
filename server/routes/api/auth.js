const router = require("express").Router();
const AuthController = require('../../controllers/Auth');


router.post("/auth/refresh", AuthController.refresh);

module.exports = router;