var express = require('express')
var exphbs = require('express-handlebars')
var nodemon = require('nodemon')
var config = require('./knexfile').development
var knex = require('knex')(config)

var app = express()

app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')


app.get('/', function(req, res) {
	knex('pokemon')
		.select()
		.then(
			function(pokemon) {
				res.render('list', {
					pokemon: pokemon
				})
			}
		)
		.catch(function(err) {
			console.log(err)
		})
})

app.get('/:id', function(req, res) {
   knex('pokemon')
   .join('eyedees', 'eyedees.pokemon_id', '=', 'pokemon.id')
   .join('types', 'types.id', '=', 'eyedees.type_id')
   .where('pokemon.id', req.params.id)
   .then(function (uniquePoke) {
      var poke = uniquePoke[0]
      var types = []
      for (var i = 0; i < uniquePoke.length; i++) {
         types.push(uniquePoke[i].type)
      }
      res.render('pokeProfile', poke)
   })
/*
   .select()
   .then(function (pokemon) {
      var uniquePoke = pokemon.filter(function (uniquePoke) {
         return uniquePoke.id === Number(req.params.id)
      })[0]
      res.render('pokeProfile', uniquePoke)
*/
   .catch(function (err) {
      console.log(err)
   })
})

module.exports = app
