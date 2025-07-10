const router = require("express").Router();
const {
  pay,
  totalBox,
  records,
  unpaid
} = require("../controllers/paymentController");

router.post("/", pay);
router.get("/total", totalBox);
router.get("/records", records);
router.get("/unpaid", unpaid);

module.exports = router;
