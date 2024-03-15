const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }//Password and username field will be created by mongoosepassportlocal default on ints own so need to create it
});
//we use the plugin of userSchema with passportlocalmongoose becaue it will create
//username and password field on its  own with hash and salt

userSchema.plugin(passportLocalMongoose);
// module.exports=mongoose.Model("User",userSchema);
module.exports=mongoose.model('User',userSchema);