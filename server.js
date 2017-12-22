const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const port = process.env.PORT || 3000;
const User = require('./app/models/user');
const apiRoutes = require('./api');


// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Settings
mongoose.connect(config.database,({
    useMongoClient : true
}));
mongoose.Promise = global.Promise;
app.set('super-secret',config.secret);

// Routes
app.get('/',(req,res)=>{
    res.send("Hola la api esta en la ruta ");
});

app.get('/setup',(req,res)=>{
    const testUser = new User({
        name : 'Mary',
        password:'123',
        admin: true
    });

    testUser.save((err)=>{
        if(err){throw err;}
        console.log("Usuario creado correctamente");
        res.json({
            success : true
        })
    })


});

// Api
app.use('/api',apiRoutes);


app.listen(port,(req,res)=>{
    console.log("Server on port 3000");
})