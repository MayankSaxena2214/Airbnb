const User=require("../models/user");
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        let registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WANDERLUST");
            // res.redirect(req.session.redirectUrl);
            res.redirect("/listings");
        })
        
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async (req,res)=>{
    //the authentication work is done by the passport and 
    //passport does through the help of middleware that we have passed in the argument
    //read the documentation on the npm passport and look for the middleware
    req.flash("success","Welcome back");
    
    let redirectUrl=req.session.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    })
}