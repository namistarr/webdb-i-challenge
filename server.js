const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).send('Welcome to the Hellmouth.')
})

server.get('/accounts', (req, res) => {
    db('accounts')
        .then(accounts => {
            res.status(200).json(accounts);
        })
        .catch(error => {
            res.status(500).json(error);
        })
});

server.get('/accounts/:id', (req, res) => {
    db('accounts').where({ id: req.params.id })
    .first()
    .then(account => {
        res.status(200).json(account);
    })
    .catch(error => {
        res.status(500).json(error);
    })
});

server.post('/accounts', (req, res) => {
    const { name, budget } = req.body;

    if (
        typeof name === 'string'
        && typeof budget === 'number'
    ) {
        db('accounts').insert({ name, budget }, 'id')
        .then(([id]) => {
            res.status(201).json(id);
        })
        .catch(error => {
            res.status(500).json(error);
        })        
    }
    else {
        res.status(400).json({
            message: 'Missing required name and/or budget.'
        })
    }
    
})

server.put('/accounts/:id', (req, res) => {
    const { name, budget} = req.body;

    if (
        typeof name === 'string'
        && typeof budget === 'number'
    ) {
        db('accounts').where({ id: req.params.id })
            .update({ name, budget })
            .then(count => {
                res.status(200).json({
                    message: `updated ${count} record`
                });
            })
            .catch(error => {
                res.status(500).json(error);
            })
    }
    else {
        res.status(400).json({
            message: 'Missing required name and/or budget.'
        })
    }
});

server.delete('/accounts/:id', (req, res) => {
    db('accounts').where({ id: req.params.id })
        .delete()
        .then(count => {
            res.status(200).json({
                message: `deleted ${count} records`
            });
        })
        .catch(error => {
            res.status(500).json(error);
        })
});



module.exports = server;