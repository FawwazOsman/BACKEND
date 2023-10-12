const express = require('express')
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt');
const { resource, response } = require('../app');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password,10)
    .then(hash => {
        const user = new User({
            username:req.body.username,
            password: hash
        });
        user.save()
        .then(result => {
            res.status(201).json({
                message: "User Created",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    });
})

router.post('/login', async (request, response) => {
     //const jwtsecret = process.env.JWT_SECRET
    //const jwtsecret = "secret_this_should_be_longer_than_it_is"

    
    const currentUser = await User.findOne(
        { username: request.body.username}
    )

    if (currentUser) {
        const result = await bcrypt.compare(request.body.password, currentUser.password);

        if (result)
        {
            const token = jwt.sign(
                { username: currentUser.username, userid: currentUser._id},
                "secret_this_should_be_longer_than_it_is",
                { expiresIn: '1h'}
            )

            response.status(200).json(
                {
                    message: 'Authentication Success',
                    username: currentUser.username,
                    token: token
                }
            )
        }
        else
        {
            return response.status(401).json(
                {
                    message: "Authentication Failure"
                }
            )
        }
    } 
    else
        {
            return response.status(401).json(
                {
                    message: "Authentication Failure"
                }
            )
        }
    

})



module.exports = router

    
   