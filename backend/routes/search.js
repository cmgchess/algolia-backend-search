const {search} = require("../controllers/search");
const express = require("express");
const router = express.Router();

router.post("/", search);


module.exports = router;