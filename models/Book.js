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
<<<<<<< HEAD
        type: DataTypes.varchar(45),
=======
        type: DataTypes.STRING(45),
>>>>>>> 78c513c7354b250e0935ac5a21c2ffd79d4998b1
        allowNull: true
      }
    },
    {
      tableName: 'Book',
      timestamps: false
    }
  );
};
