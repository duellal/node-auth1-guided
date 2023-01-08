const router = require("express").Router()
const Users = require("./users-model.js")
const {protect} = require(`../auth/authMiddleware`)

router.get("/", protect, (req, res, next) => {
  Users.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
})

module.exports = router
