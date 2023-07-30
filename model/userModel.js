module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("blog", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },

      otp: {
        type: DataTypes.STRING,
        allowNull: true
      },
      
    });
    return User;
  };
  