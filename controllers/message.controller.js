const { Messages } = require("../models");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.findAll({
      where: { user_id: from },
      order: [
        ['send_at', 'ASC'],
      ],
    });

    let projectedMessages = [];
    if (messages && messages.length > 0) {
      projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() !== to,
          from: from,
          message: msg.message,
          mark_seen: msg.mark_seen,
        };
      });
    }

    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: message,
      user_id: from,
      sender: to,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.addSocketMessage = async (res) => {
  const { from, to, msg } = res;
  const data = await Messages.create({
    message: msg,
    user_id: from,
    sender: to,
  });

  return true;
};

module.exports.messageRead = async (data) => {
  await Messages.update({ mark_seen: 1 }, { where: { user_id: data.from, sender: data.sender } });

  return true;
};
