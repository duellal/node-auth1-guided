const express = require(`express`)
const router = express.Router()
const bcrypt = require(`bcryptjs`)
const User = require(`../users/users-model`)


router.post(`/register`, async (req, res, next) => {
    try{
        const {username, password} = req.body
        const hash = bcrypt.hashSync(password, 8) //2^8 of hashing
        const newUser = {username, password: hash}
        const result = await User.add(newUser)

        res.status(201).json({
            message: `Nice to have you here, ${result.username}!`
        })
    }
    catch(err){
        next(err)
    }
})

router.post(`/login`, async (req, res, next) => {
    try{
        const {username, password} = req.body
        const [user] /*pulls first user by this username */ = await User.findBy({username})
        
        if(user && bcrypt.compareSync(password, user.password)){
            //start session:
            req.session.user = user //signals to the library that a session needs to be saved for this user - a cookie needs to be set
            res.json({
                message: `Welcome back, ${user.username}`
            })
        }
        else{
            next({
                status: 401,
                message: `Bad credentials`
            })
        }
    }
    catch(err){
        next(err)
    }
})

router.get(`/logout`, async (req, res, next) => {
   if(req.session.user){
        const {username} = req.session.user
        req.session.destroy(err => {
            if(err){
                res.json({
                    message: `Error logging out ${username}`
                })
            }
            else{
                res.set(`Set-Cookie`, `cookieMonster=; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00`)

                res.json({
                    message: `Goodbye ${username}`
                })
            }
        })
   }
   else{
    req.json({
        message: `Sorry, you are not logged in`
    })
   }
})


module.exports = router