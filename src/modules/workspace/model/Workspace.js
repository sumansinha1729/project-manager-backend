const mongoose=require('mongoose');
const slugify=require('../../../utils/slugify.js')

const workspaceSchema=new mongoose.Schema({
    name:{type:String,required:true,trim:true},
    slug:{type:String,unique:true,index:true},
    owner:{type:mongoose.Schema.Types.ObjectId,
        ref:"User",required:true,index:true
    },
    description:{type:String},
    plan:{type:String,enum:['free','pro','enterprise']},
    isDeleted:{type:Boolean,default:false}
},
{timestamps:true}
);

// ensure slug exists/updates when name changes
workspaceSchema.pre('save',async function(next){
    if(!this.isModified('name')) return next();

    const base=slugify(this.name);
    let candidate=base;
    let i=1;
    const workspace=this.constructor;
    while(await workspace.exists({slug:candidate})){
        candidate=`${base}-${i++}`;
    }
    this.slug=candidate;
    next();
});

module.exports=mongoose.model("Workspace",workspaceSchema);