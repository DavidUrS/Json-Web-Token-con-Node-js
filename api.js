const express = require('express');
const apiRouter = express.Router();
const User = require('./app/models/user');
const jbt = require('jsonwebtoken');

apiRouter.post('/authenticate',(req,res)=>{
    User.findOne({
        name: req.body.name
    },(err,user)=>{
        if(err){throw err;}
        if(!user){res.json({success:true, message:"User not found"})}
        else if(user){
            if(user.password != req.body.password){
                res.json({success:false,message:"Authenticated fallied, password incorrect"})
            }else{
                const token = jbt.sign({user}, req.app.get('super-secret'));
                res.json({success:true,message:"Enjoy your token",token})
            }
        }
    });
});




apiRouter.use((req,res,next)=>{
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jbt.verify(token,req.app.get('super-secret'),(err,decoded)=>{
            if(err){return res.json({success:false,message:"Invalid token"});}
            else{
                req.decoded=decoded;
                next();
            }
        })
    }
    else{
        return res.status(403).send({
            success:false,message:"Token not exist"
        })
    }
});

apiRouter.get('/',(req,res)=>{
    res.json({
        message : 'welcome api'
    })
});

apiRouter.get('/user',(req,res)=>{
    User.find({},(err,user)=>{
        if(err){throw err;}
        res.json({users : user})
    });
});


module.exports = apiRouter;

