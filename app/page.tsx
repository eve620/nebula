import {Footer} from "@/components/home/footer";
import TopBar from "@/components/home/top-bar";
import Guide from "@/components/home/guide";
import Notice from "@/components/home/notice";
import About from "@/components/home/about";
import getNoticeList from "@/app/actions/getNoticeList";
import Banner from "@/components/home/banner";
import Navigate from "@/components/home/navigate";

export default async function Home() {
    const notices = await getNoticeList()
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Banner Section */}
            <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
               <Banner/>
            </section>
            {/* Features Section */}
            <section className="py-16 px-5 bg-background"  id="demo">
                <Navigate/>
            </section>
            <section className="py-16 px-5 bg-background">
                <TopBar/>
            </section>
            <section className="py-16 px-5 bg-background">
                <Guide/>
            </section>
            <section className="py-16 px-4 bg-background">
                <Notice notices={notices}/>
            </section>
            <section className="py-16 px-5 bg-background" id="aboutSection">
                <About/>
            </section>
            {/* Footer */}
            <Footer/>
        </div>
    )
}
