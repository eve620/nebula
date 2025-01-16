import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url)
    const id = Number(searchParams.get('id'))
    if (!id) return NextResponse.json({error: '未登录'}, {status: 401});
    try {
        const events = await prisma.event.findMany({
            where: {
                createdById: id,
            }
        })
        const data = events.map((item) => {
            return {
                id: item.id,
                title: item.title,
                toDo: JSON.parse(item.toDo),
                inProgress: JSON.parse(item.inProgress),
                completed: JSON.parse(item.completed),
            }
        })
        return NextResponse.json({data});
    } catch {
        throw new Error("服务器出错")
    }
}

export async function POST(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.id) return NextResponse.json({error: '未登录'}, {status: 401});
    try {
        const {title, toDo, inProgress, completed} = await request.json()
        await prisma.event.create({
            data: {
                title,
                toDo: JSON.stringify(toDo),
                inProgress: JSON.stringify(inProgress),
                completed: JSON.stringify(completed),
                createdById: currentUser.id
            },
        });
        return NextResponse.json({message: 'ok'})
    } catch {
        throw new Error("服务器出错")
    }
}

export async function PUT(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.id) return NextResponse.json({error: '未登录'}, {status: 401});
    try {
        const {title, toDo, inProgress, completed} = await request.json()
        await prisma.event.update({
            where: {
                title_createdById: {
                    title,
                    createdById: currentUser.id,
                }
            },
            data: {
                toDo: JSON.stringify(toDo),
                inProgress: JSON.stringify(inProgress),
                completed: JSON.stringify(completed),
            },
        });
        console.log(111)
        return NextResponse.json({message: 'ok'})
    } catch {
        throw new Error("服务器出错")
    }
}

export async function DELETE(request: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.id) return NextResponse.json({error: '未登录'}, {status: 401});
    try {
        const {title} = await request.json()
        const eventToDelete = await prisma.event.findUnique({
            where: {
                title_createdById: {
                    title: title,
                    createdById: currentUser.id,
                },
            },
        });

        if (!eventToDelete) {
            return NextResponse.json({error: '查询删除项失败'}, {status: 404});
        }
        await prisma.event.delete({
            where: {
                title_createdById: {
                    title: title,
                    createdById: currentUser.id,
                }
            }
        })
        return NextResponse.json({message: 'ok'})
    } catch {
        throw new Error("服务器出错")
    }
}
