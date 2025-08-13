const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,unique:true,lowercase:true,index:true},
    password:{type:String,required:true,select:false},
    avatarUrl:{type:String},
        // for refresh token rotation: bump on logout or compromise

    tokenVersion:{type:Number,default:0}
},{
    timestamps:true
});


// hash password if modified
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }

    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
});


// compare password
userSchema.methods.comparePassword=function(candidate){
    return bcrypt.compare(candidate,this.password);
};


// hide sensitive fields when converting to JSON
userSchema.method.toJSONsafe=function(){
    const obj=this.toObject();
    delete obj.password;
    return obj;
};

module.exports=mongoose.model("User",userSchema);