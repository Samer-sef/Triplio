const router = require("express").Router();
const UsersController = require('../../controllers/Users');


router.post("/users/register", UsersController.register);
router.post("/users/login", UsersController.login);

module.exports = router;