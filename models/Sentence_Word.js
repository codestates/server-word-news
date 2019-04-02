/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Sentence_Word', {
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
		sentence_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'Sentence',
				key: 'id'
			}
		}
	}, {
		tableName: 'Sentence_Word',
		timestamps: false
	});
};
