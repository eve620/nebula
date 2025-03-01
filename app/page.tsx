import {Footer} from "@/components/home/footer";
import TopBar from "@/components/home/top-bar";
import Guide from "@/components/home/guide";
import Notice from "@/components/home/notice";
import About from "@/components/home/about";
import Banner from "@/components/home/banner";
import Navigate from "@/components/home/navigate";

export default async function Home() {
    // const bgImages = ["/bg/bg1.jpeg", "/bg/bg2.jpeg", "/bg/bg3.jpeg", "/bg/bg4.jpeg", "/bg/bg5.jpeg", "/bg/bg6.jpeg"];
    // const bgImage = bgImages[Math.floor(Math.random() * bgImages.length)]
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Banner Section */}
            <section className="relative max-h-[calc(100vh-4rem)] h-[100vh] flex items-center justify-center bg-background">
                <Banner/>
            </section>
            {/* Features Section */}
            <section className="py-16 px-5 bg-background" id="demo">
                <Navigate/>
            </section>
            <section className="py-16 px-5 bg-background">
                <TopBar/>
            </section>
            <section className="py-16 px-5 bg-background">
                <Guide/>
            </section>
            <section className="py-16 px-4 bg-background">
                <Notice/>
            </section>
            <section className="py-16 px-5 bg-background" id="aboutSection">
                <About/>
            </section>
            {/* Footer */}
            <Footer/>
        </div>
    )
}
