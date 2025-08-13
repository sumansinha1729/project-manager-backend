const mongoose=require('mongoose');

const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            dbName:"PROJECT-MANAGER"
        });
        console.log('MongoDB connected successfully.')
    } catch (error) {
        console.log("MongoDB connection failed ",error);
        process.exit(1);
    }
};

module.exports=connectDb;