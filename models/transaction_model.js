module.exports = (sequelize, Sequelize) => {
    const transact_log = sequelize.define("transact_log", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },  
    debitor_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
    creditor_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
    bank: {
        type: Sequelize.STRING,
        allowNull: false
      },
    account: {
        type: Sequelize.STRING,
        allowNull: false
      },
    amount: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
    
    status: {
        type: Sequelize.STRING,
        allowNull: false
      },

    eth_ref: {
        type: Sequelize.STRING,
        allowNull: false
      } 
    }
    );
    return transact_log;
  };
  