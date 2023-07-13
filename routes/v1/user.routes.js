const express = require("express");
const router = express.Router();

const {submit,result} = require('../../controllers/user.controller');
const { authorization } = require("../../middleware/authorization");


/**
 * Endpoint: /v1/user
*/


router.post("/submit",authorization,submit);
router.get("/result/:id",authorization,result);





module.exports = router;

