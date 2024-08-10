if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
console.log(process.env.SECRET);
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");

//basic setup for loginsignup
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

// const router=require("./routes/listing.js");
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
});


async function main(){
    await mongoose.connect(dbUrl);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
// checked 
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*60*60,// in seconds
});
store.on("error",()=>{
    console.log("Error in MONGO SESSION STORE",err);
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
}
app.get("/",(req,res)=>{
   res.redirect("/listings");
});
//checked

app.use(session(sessionOptions));
//flash ke baad hi route use karna hai
app.use(flash());

//checked
//we need session to use the login signup so we write code after the session middleware
app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//creating middleware for the flash
app.use((req,res,next)=>{
    //checked
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    //checked
    //storing the current user login info in the locals

    res.locals.currUser=req.user;
    next();
});
// app.get("/demouser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//         //we have not added the password here but we add the password at the time of register method
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err,message});
    
});
app.listen(8080,(req,res)=>{
    console.log("Server is listening on the port 8080");
});
