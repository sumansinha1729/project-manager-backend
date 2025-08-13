const mongoose=require('mongoose');

const membershipSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,
        ref:"User",required:true,index:true
    },
    workspace:{type:mongoose.Schema.Types.ObjectId,
        ref:"Workspace",required:true,index:true
    },
    role:{type:String,enum:[
        'OWNER','ADMIN','MEMBER'
    ], default:'MEMBER'},
    status:{type:String,enum:[
        'active','invited'
    ], default:'active'}
},{timestamps:true});

// prevent duplicates; speed permission check
membershipSchema.index({workspace:1,user:1}, {unique:true});

module.exports=mongoose.model("Membership",membershipSchema);