 const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
 const userSchema=new mongoose.Schema({
     name:{
         type:String,
         required:true
     },
     email:{
         type:String,
         required:true
     },
     phone:{
        type:Number,
        required:true
    },
    work:{
        type:String,
        require:true
    },
     password:{
         type:String,
         required:true
     },
     cpassword:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    balance:{
        type:Number,
        default:100000
    },
    messages:[
        {
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            message:{
               type:String,
               required:true
           },
        }
    ],
    transactions:[
        {
            sender_Id:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            amount:{
               type:String,
               required:true
           },
           deposited:{
               type:Boolean,
               reuired: true
           }
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]

 })

 

 userSchema.pre('save',async function(next){
    //  console.log("user from inside");
     if(this.isModified('password')){
         this.password=await bcrypt.hash(this.password,12);
        //  console.log(this.password);
         this.cpassword=await bcrypt.hash(this.cpassword,12);
     }
     next();
 })


 userSchema.methods.generateAuthToken=async function(){
     try{
         const token=jwt.sign({_id:this._id},process.env.SECRET_KEY);
         this.tokens=this.tokens.concat({token:token});
         await this.save();
         return token;
     }catch(err){
         console.log(err);
     }
 }
 userSchema.methods.addMessage=async function(name,email,message){
     try{
         this.messages=this.messages.concat({name,email,message});
         await this.save();
         return this.message;
     }
     catch(err){
         console.log(err);
     }
 }
 userSchema.methods.addTransaction=async function(email,sender_Id,amount,deposited){
    try{
        this.transactions=this.transactions.concat({sender_Id,email,amount,deposited});
        if(deposited==true){
            this.balance=this.balance+parseInt(amount);
        }
        else{
            this.balance=this.balance-parseInt(amount);
        }
        await this.save();
        return this.transactions;
    }
    catch(err){
        console.log(err);
    }
}

 const User=mongoose.model(`USER`,userSchema);
 module.exports=User;
