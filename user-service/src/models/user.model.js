const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const logger = require("../config/logger");

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isAlphanumeric: {
          args:true,
          msg:`Username should be only letters and numbers`
        },
        notNull: {
          msg: "Please provide username",
        },
      },
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlphanumeric: {
          args:true,
          msg:`Full name should be only letters and numbers`
        },
        notNull: {
          msg: `Please provide full name`,
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: `Email format is invalid`,
        },
      },
    },
    profilePicURL: {
      type: DataTypes.STRING(2048),
    },
    profilePicKey: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true }
);

User.sync()
  .then(() => {
    logger.info("User model created");
  })
  .catch((err) => {
    logger.error(`Error in creating 'User' model: ${err}`);
  });

module.exports = User;
