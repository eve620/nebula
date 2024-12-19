import Image from 'next/image'
import {Button} from "@/components/ui/button"
import {AnimatedText} from '@/components/animated-text'
import {CharacterCard} from '@/components/character-card'
import {Footer} from "@/components/home/footer";
import TopBar from "@/components/home/top-bar";
import Guide from "@/components/home/guide";
import Notice from "@/components/home/notice";
import About from "@/components/home/about";
import getNoticeList from "@/app/actions/getNoticeList";

const characters = [
    {
        name: "艾丽斯",
        role: "主角",
        description: "一位神秘的黑客,拥有操控电子设备的能力。",
        imageUrl: "/placeholder.svg",
        skills: [
            {name: "黑客入侵", description: "能够入侵任何电子设备", power: 95},
            {name: "数据分析", description: "快速处理和分析大量数据", power: 90},
            {name: "电子干扰", description: "干扰敌人的电子设备", power: 85}
        ]
    },
    {
        name: "杰克",
        role: "战士",
        description: "前特种部队成员,精通各种武器和格斗技巧。",
        imageUrl: "/placeholder.svg",
        skills: [
            {name: "近身格斗", description: "精通多种格斗技巧", power: 95},
            {name: "枪械专家", description: "精通各种枪械的使用", power: 90},
            {name: "战术分析", description: "快速分析战场局势", power: 85}
        ]
    },
    {
        name: "莉莉",
        role: "科学家",
        description: "天才生物工程师,致力于研究人类增强技术。",
        imageUrl: "/placeholder.svg",
        skills: [
            {name: "基因工程", description: "改造生物基因", power: 95},
            {name: "医疗急救", description: "快速治疗队友伤势", power: 90},
            {name: "药物研发", description: "研发各种强化药剂", power: 85}
        ]
    }
]

export default async function Home() {
    const notices = await getNoticeList()
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/placeholder.svg"
                        alt="Cyberpunk city background"
                        layout="fill"
                        objectFit="cover"
                        className="opacity-50 dark:opacity-30"
                    />
                </div>
                <div className="relative z-10 text-center">
                    <h1 className="text-6xl font-bold mb-4 animate-pulse">绝区零</h1>
                    <p className="text-xl mb-8">
                        <AnimatedText text="探索未来都市的秘密"/>
                    </p>
                    <Button>
                        立即体验
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-5 bg-background">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="未来都市"
                        description="探索充满霓虹和高科技的未来都市"
                        icon="🏙️"
                    />
                    <FeatureCard
                        title="激烈战斗"
                        description="体验快节奏、流畅的动作战斗系统"
                        icon="⚔️"
                    />
                    <FeatureCard
                        title="丰富剧情"
                        description="沉浸在扣人心弦的故事情节中"
                        icon="📖"
                    />
                </div>
            </section>

            {/* Characters Section */}
            <section className="py-16 px-5 bg-muted">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-center">游戏角色</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {characters.map((character, index) => (
                            <CharacterCard
                                key={index}
                                name={character.name}
                                role={character.role}
                                description={character.description}
                                imageUrl={character.imageUrl}
                                skills={character.skills}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* World Section */}
            <section className="py-16 px-5 bg-background">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12 text-center">游戏世界</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">新世纪都市</h3>
                            <p className="text-muted-foreground mb-6">
                                在这个充满高科技和低生活的未来世界中,巨型企业掌控着一切,而普通人则在霓虹灯下挣扎求生。街头充满了危险与机遇,每个人都在寻找属于自己的一席之地。
                            </p>
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                立即体验
                            </Button>
                        </div>
                        <div className="relative h-64 md:h-96">
                            <Image
                                src="/placeholder.svg"
                                alt="New Century City"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                            />
                        </div>
                    </div>
                </div>
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

function FeatureCard({title, description, icon}) {
    return (
        <div
            className="bg-card p-6 rounded-lg shadow-lg dark:shadow-slate-800 hover:bg-accent transition-transform hover:transition ease-in-out hover:-translate-y-1">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    )
}

