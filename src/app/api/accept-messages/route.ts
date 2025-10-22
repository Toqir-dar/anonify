import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {

    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            {
                status: 401
            }
        );
    }

    const userId = user._id
    const { acceptedMessages } = await request.json()

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: acceptedMessages }, { new: true });

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User message acceptance preference updated successfully",
                updatedUser
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.error("Error accepting messages:", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server Error"
            },
            {
                status: 500
            }
        );
    }

}

export async function GET(request: Request) {

    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            {
                status: 401
            }
        );
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            );
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.error("Error fetching message acceptance preference:", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server Error"
            },
            {
                status: 500
            }
        );
    }
}
