/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      user_name: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      email: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      target_lang: {
        type: DataTypes.ENUM('en', 'jp', 'cn'),
        allowNull: true
      },
      use_lang: {
        type: DataTypes.ENUM('kr'),
        allowNull: true
      },
      level: {
        type: DataTypes.INTEGER(11),
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
      tableName: 'User',
      timestamps: false
    }
  );
};
