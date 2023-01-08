async function protect(req, res, next){
    if(req.session.user){
        next()
    }  
    else{
        next({
            status: `401`,
            message: `You are not permitted`
        })
    }
}


module.exports = {
    protect, 

}