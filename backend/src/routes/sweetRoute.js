const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const sweetCtrl = require("../controllers/sweetController");

router.post("/", upload.single("image"), sweetCtrl.createSweet);

router.get("/", sweetCtrl.listSweets);
router.get("/:id", sweetCtrl.getSweet);
router.put("/:id", upload.single("image"), sweetCtrl.updateSweet);
router.delete("/:id", sweetCtrl.deleteSweet);

module.exports = router;
