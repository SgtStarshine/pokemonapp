module.exports = function(sequelize, DataTypes){
    var Pokemon = sequelize.define("Pokemon", {
        pokemonName: DataTypes.STRING,
        types: DataTypes.ARRAY(DataTypes.TEXT),
        moves: DataTypes.ARRAY(DataTypes.TEXT),
        species: DataTypes.STRING,
        sprites: DataTypes.ARRAY(DataTypes.TEXT)
    });
    Pokemon.belongsTo(Team,{foreignKey: "pokemonName",targetKey: "name"})
}