const express = require("express");
const router = express.Router();

const {} = require('../../controllers/user.controller');
const { authorization } = require("../../middleware/authorization");


/**
 * Endpoint: /v1/member
*/

router.post("/",authorization,addMember)
router.delete("/:id",authorization,removeMember)





module.exports = router;

