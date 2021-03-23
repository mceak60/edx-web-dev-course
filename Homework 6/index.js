var express = require('express');
var app = express();

var Animal = require('./Animal.js');
var Toy = require('./Toy.js');

/*
app.use('/', (req, res) => {
    res.json({ msg : 'It works!' });
});
*/


app.use( '/findToy', (req, res) => {

    var query = {};
    if (req.query.id)
        query.id = { $regex :  req.query.id };
    if (Object.keys(query).length != 0) {
        Toy.findOne( query, (err, toys) => {
            if (!err)
                res.json(toys);
                //res.write(toys)
            else {
                console.log(err)
                res.json({});
            }
        });
    }
    else res.json({});

});

app.use( '/findAnimals', (req, res) => {

    var query = {};
    if (req.query.species)
        query.species = { $regex :  req.query.species };
    if (req.query.gender)
        query.gender = { $regex :  req.query.gender };
    if (req.query.trait)
        query.trait = { $regex :  req.query.trait };

    if (Object.keys(query).length != 0) {
        Animal.find( query, (err, animals) => {
            if (!err)
                res.json(animals);
            else {
                console.log(err)
                res.json({});
            }
        });
    }
    else res.json({});

});

app.use( '/animalsYoungerThan', (req, res) => {

    var query = {};
    if (req.query.age)
        query.age = { $regex :  req.query.age };
    if (Object.keys(query).length != 0 && !(isNaN(query.age))) {
        Toy.find( {age: {$lt: query.age}} , (err, animals) => {
            if (!err) {
                if (animals.length === 0)
                    res.json({count: 0});
                else {
                    var i = 0;
                    var animalNames = [];
                    for (i; i < animals.length; i++) {
                        animalNames[i] = animals[i].name;
                    }
                    res.json({count: animals.length, names: animalNames});
                }
            }
            else {
                console.log(err)
                res.json({});
            }
        });
    }
    else res.json({});

});

app.use( '/calculatePrice', (req, res) => {

    var query = {};
    if (req.query.id)
        query.id = { $regex :  req.query.id };
    if (req.query.qty)
        query.qty = { $regex : req.query.qty };
    if (Object.keys(query).length != 0 && query.id.length === query.qty.length) {
        Toy.find( query.id, (err, toys) => {
            if (!err) {
                var i = 0;
                var ignoring = 0;
                var toyArray = [{}];
                var total = 0;
                for (i; i < query.id.length; i++) {
                    if (query.qty[i] < 1 || isNaN(query.qty[i])) {
                        ignoring++;
                    }
                    else {
                        var sub = query.qty[i] * toyPrice;
                        total += sub;
                        toyArray[i] = {item: query.id[i], qty: query.qty[i], subtotal: sub}
                    }
                }
                var ignore = false;
                if (ignoring === query.qty.id)
                    ignore = true;
                if (ignore)
                    res.json({totalPrice: 0, items: []});
                else {
                    res.json({items: toyArray, totalPrice: total});
                }
            }
            else {
                console.log(err)
                res.json({});
            }
        });
    }
    else res.json({});

});


app.use(/*default*/ (req, res) => {
    res.json({ msg : 'It works!' });
});

app.listen(3000, () => {
	console.log('Listening on port 3000');
    });



// Please do not delete the following line; we need it for testing!
module.exports = app;