const express = require("express");
const router = express.Router();

const {login,signup} = require('../../controllers/auth.controller')
const {authorization} = require("../../middleware/authorization")

/**
 * Endpoint: /v1/auth
*/

router.post("/signup",signup);
router.post("/login",login);


module.exports = router;

