const express = require("express");
const routerV1 = require('./v1');

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Backend server is running!!!");
});

router.use("/v1", routerV1);

module.exports = router;
