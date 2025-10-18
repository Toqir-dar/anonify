import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string;
    createdAt:Date;
}

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessages:boolean;
    messages:Message[];
}

const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true
    }
})

const UserSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        unique:true
    },
    verifyCode:{
        type:String,
        required:[true,"Verify code is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify code expiry is required"],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true
    },
    messages: [MessageSchema] 
})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User',UserSchema);
export default UserModel;