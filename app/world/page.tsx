'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'

interface Location {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  keyPoints: string[];
}

const locations: Location[] = [
  {
    id: '1',
    name: '新纪元城',
    description: '新纪元城是绝区零的中心城市，高耸入云的摩天大楼与霓虹灯交相辉映，展现了一个充满未来感的都市景象。',
    imageUrl: '/placeholder.svg',
    keyPoints: ['中央广场', '科技研究所', '地下黑市']
  },
  {
    id: '2',
    name: '荒芜之地',
    description: '荒芜之地是城市外围的废弃区域，充满了危险和机遇。这里是冒险者和赏金猎人的天堂。',
    imageUrl: '/placeholder.svg',
    keyPoints: ['废弃工厂', '辐射区', '幸存者营地']
  },
  {
    id: '3',
    name: '海底都市',
    description: '海底都市是人类为了应对环境变化而建造的水下城市，这里有着独特的建筑和生态系统。',
    imageUrl: '/placeholder.svg',
    keyPoints: ['珊瑚花园', '深海研究中心', '水下交通枢纽']
  }
]

export default function World() {
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">世界</h1>
        <Tabs defaultValue={locations[0].id} onValueChange={(value) => setSelectedLocation(locations.find(l => l.id === value) || locations[0])}>
          <TabsList className="w-full mb-4">
            {locations.map((location) => (
              <TabsTrigger key={location.id} value={location.id} className="flex-1">
                {location.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={selectedLocation.id}>
            <Card>
              <CardHeader>
                <CardTitle>{selectedLocation.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Image
                    src={selectedLocation.imageUrl}
                    alt={selectedLocation.name}
                    width={600}
                    height={400}
                    className="rounded-md w-full h-auto"
                  />
                  <div className="space-y-4">
                    <p>{selectedLocation.description}</p>
                    <div>
                      <h3 className="font-semibold mb-2">主要地点：</h3>
                      <ul className="list-disc list-inside">
                        {selectedLocation.keyPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

