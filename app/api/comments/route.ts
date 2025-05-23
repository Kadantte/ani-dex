import { ANIMECOMMENTS, HOUR } from "@/app/lib/constants";
import dbConnect from "@/app/lib/dbConnect";
import { deleteCacheData, getCacheData, setCacheData } from "@/app/lib/server-utils";
import { isDataEmptyorUndefined } from "@/app/lib/utils";
import CommentsModel, { Comment } from "@/model/Comments";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const data = await request.json();

        if (isDataEmptyorUndefined(data.animeId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "anime id is empty",
                },
                {
                    status: 500,
                }
            );
        } else if (isDataEmptyorUndefined(data.userId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "user id is empty",
                },
                {
                    status: 500,
                }
            );
        }

        const newComment = new CommentsModel({ ...data });
        await newComment.save();

        const cacheKey = `${ANIMECOMMENTS}_${data.animeId}`;
        await deleteCacheData(cacheKey);

        return NextResponse.json(
            { success: true, message: "Comment successfully added" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Error saving a comment",
                err: error,
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        const searchParams = request.nextUrl.searchParams;
        const animeId = searchParams.get("animeId");
        const cacheKey = `${ANIMECOMMENTS}_${animeId}`;
        let rootComments = await getCacheData(cacheKey);

        if (!rootComments) {
            const allComments = await CommentsModel.find({ animeId })
                .sort({ createdAt: -1 })
                .lean()
                .exec();
            const commentsMap = new Map();
            rootComments = [];

            allComments.forEach((comment) => commentsMap.set(comment._id.toString(), comment));
            allComments.forEach((comment) => {
                if (comment.parentId) {
                    commentsMap.get(comment.parentId.toString())?.replies.push(comment);
                } else {
                    rootComments.push(comment);
                }
            });

            await setCacheData(cacheKey, 1 * HOUR, rootComments);
        }

        return NextResponse.json({ success: true, data: rootComments }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Error while fetching comments",
                err: error,
            },
            {
                status: 500,
            }
        );
    }
}
