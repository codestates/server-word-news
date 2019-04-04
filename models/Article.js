/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Article',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      author: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      photoURL: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      category_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Category',
          key: 'id'
        }
      }
    },
    {
      tableName: 'Article',
      timestamps: false
    }
  );
};
