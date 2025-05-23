import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";
import FavouritesModel from "@/model/Favourites";
import WatchlistModel from "@/model/Watchlist";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password, name } = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                {
                    status: 400,
                }
            );
        }

        const existingUserByEmail = await UserModel.findOne({
            email,
        });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exist with this email",
                    },
                    {
                        status: 400,
                    }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);

                existingUserByEmail.name = name;
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = expiryDate;

                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new UserModel({
                name,
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
            });
            const savedUser = await newUser.save();

            const userFavourites = new FavouritesModel({
                userId: newUser._id,
                animeIds: [],
            });
            await userFavourites.save();

            const userWatchlist = new WatchlistModel({
                userId: savedUser._id,
                watchlist: {
                    Watching: [],
                    "On-Hold": [],
                    "Plan to watch": [],
                    Dropped: [],
                    Completed: [],
                },
            });
            await userWatchlist.save();
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        } else {
            return Response.json(
                {
                    success: true,
                    message: "User registered successfully. Please verify your email",
                },
                { status: 200 }
            );
        }
    } catch (error) {
        console.log("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            {
                status: 500,
            }
        );
    }
}
