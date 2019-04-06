/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Word',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      word: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      translation: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      grade: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      sentence_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      }
    },
    {
      tableName: 'Word',
      timestamps: false
    }
  );
};
