const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
});


async function main(){
    await mongoose.connect(MONGO_URL);
}
// now we will write the function for the initializing
//but before initializing we will delete the previos data;
const initDB= async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"65ec8273aad56325bd7ae142"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();