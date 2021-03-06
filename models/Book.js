/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Book',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      date: {
        type: DataTypes.STRING(45),
        allowNull: true
      }
    },
    {
      tableName: 'Book',
      timestamps: false
    }
  );
};
