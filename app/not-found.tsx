import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col h-[80vh] justify-center items-center">
            <div className="flex items-center mb-3">
                <h2 className="text-4xl font-bold">404</h2>
            </div>
            <p className="text-lg mb-6">无法找到该页面</p>
            <Link href="/"
                  className="px-6 py-2 text-background bg-foreground font-semibold rounded-lg shadow-md hover:opacity-80 transition-opacity">
                点击返回首页
            </Link>
        </div>
    )
}