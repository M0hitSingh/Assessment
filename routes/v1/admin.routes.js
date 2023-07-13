const express = require("express");
const router = express.Router();

const {addProblem,updateProblem,deleteProblem} = require('../../controllers/admin.controller');
const { authorization } = require("../../middleware/authorization");
const {adminRestrict} = require("../../middleware/adminRestrict");


/**
 * Endpoint: /v1/admin
*/

router.post("/add/problem",authorization,adminRestrict,addProblem);
router.put("/update/problem/:id",authorization,adminRestrict,updateProblem);
router.delete("/delete/problem/:id",authorization,adminRestrict,deleteProblem);





module.exports = router;

