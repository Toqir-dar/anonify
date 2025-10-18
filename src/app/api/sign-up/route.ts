import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import User from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerifiedd: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {
                    status: 400
                }
            );
        }
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
           if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "Email is already registered"
                    },
                    {
                        status: 400
                    }
                );
           }else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
                await existingUserByEmail.save();
           }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour from now

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerifiedd: false,
                messages: [],


            });
            await newUser.save();
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(
            username,
            email,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Verification code sent to email"
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.error("Error during sign-up:", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            {
                status: 500
            }
        );
    }
}