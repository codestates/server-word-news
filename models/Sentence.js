/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Sentence',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      article_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'Article',
          key: 'id'
        }
      },
      index: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      }
    },
    {
      tableName: 'Sentence',
      timestamps: false
    }
  );
};
