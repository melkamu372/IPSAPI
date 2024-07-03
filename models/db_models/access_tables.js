const { sequelize, Sequelize } = require("../../config/db_con_pool.js");
const token_model = require("../token_model.js")(sequelize, Sequelize);
module.exports = {token_model};
