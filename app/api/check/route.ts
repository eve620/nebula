import getCurrentUser from "@/app/actions/getCurrentUser";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
    // 获取当前用户，若未登录直接返回 401 错误
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.json({error: '未登录'}, {status: 401});
    }
    const {id} = currentUser;
    // 使用 Promise.all 以并发执行多个数据库查询
    const [
        friendRequestCount,
        newMessageCount,
        newLikeCount,
        newCommentCount,
        newChildCommentCount
    ] = await Promise.all([
        prisma.friendRequest.count({where: {receiverId: id}}),
        prisma.message.count({where: {receiverId: id, isRead: false}}),
        prisma.like.count({where: {articleById: id, isRead: false}}),
        prisma.comment.count({where: {articleById: id, isRead: false}}),
        prisma.childComment.count({where: {commentToById: id, isRead: false}})
    ]);

    // 返回查询结果
    return NextResponse.json({
        hasFriendRequest: friendRequestCount > 0,
        hasNewMessage: newMessageCount > 0,
        hasNewComment: newCommentCount + newChildCommentCount > 0,
        hasNewLike: newLikeCount > 0
    });

}