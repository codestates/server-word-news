module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define(
    'Category',
    {
      name: DataTypes.STRING
    },
    {}
  );
  category.associate = function(models) {};
  return category;
};
