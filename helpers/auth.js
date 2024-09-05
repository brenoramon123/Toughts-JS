
const checkAuth = function(req,res,next){
    const sessionId = req.cookies.sessionid;
    console.log("sessionId",req.session.userId)
    const userId = req.session.userId

    if(!userId){
        res.redirect("/login")
    }

    next()
}

module.exports = checkAuth
