const express = require("express");
const router = express.Router();

const {submit,result,allProblem} = require('../../controllers/user.controller');
const { authorization } = require("../../middleware/authorization");


/**
 * Endpoint: /v1/user
*/


router.post("/submit",authorization,submit);
router.get("/result/:id",authorization,result);
router.get("/problem/all",authorization,allProblem)





module.exports = router;

