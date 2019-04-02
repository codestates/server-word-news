/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Book_Word', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		word_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'Word',
				key: 'id'
			}
		},
		book_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'Book',
				key: 'id'
			}
		},
		complete: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		}
	}, {
		tableName: 'Book_Word',
		timestamps: false
	});
};
