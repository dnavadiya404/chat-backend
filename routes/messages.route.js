const router = require("express").Router();
const { addMessage, getMessages } = require("../controllers/message.controller.js");

router.post("/addMsg/", addMessage);
router.post("/getMsg/", getMessages);

module.exports = router;
