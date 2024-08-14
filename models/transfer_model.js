module.exports = (sequelize, Sequelize) => {
    const transfers = sequelize.define("transfers", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },  
        debitor_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        creditor_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        bank: {
            type: Sequelize.STRING,
            allowNull: false
        },
        creditor_account: {
            type: Sequelize.STRING,
            allowNull: false
        },
        debitor_account: {
            type: Sequelize.STRING,
            allowNull: true
        },
        amount: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        transaction_code: {
            type: Sequelize.STRING,
            allowNull: false
        }, 
        eth_ref: {
            type: Sequelize.STRING,
            allowNull: true
        }, 
        remark: {
            type: Sequelize.STRING,
            allowNull: true
        }, 
        reverse_status: {
            type: Sequelize.STRING,
            allowNull: true
        }, 
        reverse_remark: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });
    
    return transfers;
};
