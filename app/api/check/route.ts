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
        senders,
        newLikeCount,
        newCommentCount,
        newChildCommentCount
    ] = await Promise.all([
        prisma.friendRequest.count({where: {receiverId: id}}),
        prisma.message.groupBy({
            by: ['senderId'],  // 按照 senderId 分组
            where: {
                receiverId: id,   // 只选择目标接收者的消息
                isRead: false,     // 只选择未读消息
            },
        }),
        prisma.like.count({where: {articleById: id, isRead: false}}),
        prisma.comment.count({where: {articleById: id, isRead: false}}),
        prisma.childComment.count({where: {commentToById: id, isRead: false}})
    ]);
    const unreadSenders = senders.map(item => item.senderId);

    // 返回查询结果
    return NextResponse.json({
        hasFriendRequest: friendRequestCount > 0,
        unreadSenders: unreadSenders || [],
        hasNewComment: newCommentCount + newChildCommentCount > 0,
        hasNewLike: newLikeCount > 0
    });

}