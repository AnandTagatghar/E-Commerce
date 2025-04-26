const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

const Auth = sequelize.define(
  "Auth",
  {
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Plese provide email`,
        },
        isEmail: {
          msg: `Plese provide valid email format`,
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validator: {
        notNull: `Please provide password`,
      },
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    tableName: `Auth`,
    hooks: {
      beforeCreate: async (record) => {
        if (record.password) {
          record.password = await bcrypt.hash(record.password, 10);
        }
      },
      beforeUpdate: async (record) => {
        if (record.changed("password")) {
          record.password = await bcrypt.hash(record.password, 10);
        }
      },
    },
  }
);

Auth.prototype.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

Auth.prototype.generateRefreshToken = function () {
  return jwt.sign(
    { email: this.email },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY }
  );
};

Auth.prototype.generateAccessToken = function () {
  return jwt.sign(
    { email: this.email },
    process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY }
  );
};

Auth.sync()
  .then(() => {
    logger.info(`Auth table create`);
  })
  .catch((err) => {
    logger.error(`Error creating Auth Model: ${err.message}`);
  });

module.exports = Auth;
