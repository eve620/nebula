import {NextResponse} from 'next/server'
import getCurrentUser from "@/app/actions/getCurrentUser";
import {v4 as uuid} from 'uuid'
import {put} from "@vercel/blob";


export async function POST(request: Request) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({error: '未登录'}, {status: 401});
    const formData = await request.formData();
    const image = formData.get("image") as Blob;
    const filename = uuid()
    if (image) {
        const response = await put(`article/${filename}`, image, {
            access: 'public',
        })
        return NextResponse.json(response.url, {status: 200})
    }
}
