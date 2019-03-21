module.exports = function(sequelize, DataTypes){
    var Team = sequelize.define("Team", {
        name: DataTypes.STRING
    });
    Team.hasMany(Pokemon, {foreignKey:"pokemonName", sourceKey:"name"});
}