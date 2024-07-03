module.exports = (sequelize, Sequelize) => {
    const token_list = sequelize.define("token_list", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },  
      accessToken: {
        type: Sequelize.STRING,
        allowNull: false
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: false
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      refreshExpiresAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }

    );
    return token_list;
  };
  