module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    firstName:{
      type: Sequelize.STRING(30),
    },
    lastName: {
      type: Sequelize.STRING(30)
    },
    companyName: {
      type: Sequelize.STRING(30)
    },
    country_code : {
      type :Sequelize.STRING(4)
    },
    phone: {
      type: Sequelize.STRING(10)
    },
    folder: {
      type: Sequelize.STRING
    },
    facebook: {
      type: Sequelize.STRING
    },
    instagram: {
      type: Sequelize.STRING
    },
    linkedin: {
      type: Sequelize.STRING
    },
    twitter: {
      type: Sequelize.STRING
    },
    picture: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING(30),
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: Sequelize.STRING
    },
  });

  return User;
};