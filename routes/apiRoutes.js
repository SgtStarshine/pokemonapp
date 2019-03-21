var db = require("../models");

module.exports = function(app){
    app.get("/api/team", function(req, res){
        db.Team.findAll({}).then(function (dbTeam){
            res.json(dbTeam);
        });
    });

    app.get("/api/pokemon", function(req, res){
        db.Pokemon.findAll({}).then(function (dbPokemon){
            res.json(dbPokemon);
        });
    });

    app.post("/api/team", function(req, res){
        db.Team.create({
            name: req.body.name
        }).then(function(dbTeam){
            res.json(dbTeam);
        }).catch(function(err){
            res.json(err);
        });
    })

    app.post("/api/Pokemon", function(req, res){
        db.Pokemon.create({
            pokemonName:req.body.name,
            types:req.body.types,
            moves:req.body.moves,
            species:req.body.species,
            sprites:req.body.sprites
        },).then(function(dbPokemon){
            res.json(dbPokemon);
        }).catch(function(err){
            res.json(err);
        });
    })

    app.put("/api/team", function(req, res){
        db.Team.create({
            name: req.body.name
        },{
            where:{
                id: req.body.id
            }
        }).then(function(dbTeam){
            res.json(dbTeam);
        }).catch(function(err){
            res.json(err);
        });
    });

    app.put("/api/pokemon", function(req,res){
        db.Pokemon.create({
            pokemonName:req.body.name,
            types:req.body.types,
            moves:req.body.moves,
            species:req.body.species,
            sprites:req.body.sprites
        },{
            where:{
                id:req.body.id
            }
        }).then(function(dbPokemon){
            res.json(dbPokemon);
        }).catch(function(err){
            res.json(err);
        });
    });

    app.delete("/api/team/:id", function(req, res){
        db.Team.destroy({
            where:{
                id: req.params.id
            }
        }).then(function(dbTeam){
            res.json(dbTeam)
        });
    });

    app.delete("/api/pokemon/:id", function(req, res){
        db.pokemon.destroy({
            where:{
                id: req.params.id
            }
        }).then(function(dbPokemon){
            res.json(dbPokemon)
        });
    });
}