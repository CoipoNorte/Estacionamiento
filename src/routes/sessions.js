const router = require("express").Router();
const { start, close } = require("../controllers/sessionController");
router.post("/", start);
router.post("/:id/close", close);
module.exports = router;
