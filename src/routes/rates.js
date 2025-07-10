const router = require("express").Router();
const { getRates, updateRates } = require("../controllers/rateController");
router.get("/", getRates);
router.post("/", updateRates);
module.exports = router;
