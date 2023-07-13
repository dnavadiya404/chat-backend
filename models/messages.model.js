module.exports = (sequelize, Sequelize) => {
  const Messages = sequelize.define("Messages", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sender: {
      type: Sequelize.STRING,
      allowNull: false
    },
    mark_seen: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    },
    send_at: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, {
    timestamps: false,
    freezeTableName: true,
  });
  return Messages;
};
