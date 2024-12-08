'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { CharacterDetailModal } from './character-detail-modal'

interface Skill {
  name: string
  description: string
  power: number
}

interface CharacterCardProps {
  name: string
  role: string
  description: string
  imageUrl: string
  skills: Skill[]
}

export function CharacterCard({ name, role, description, imageUrl, skills }: CharacterCardProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  return (
    <>
      <div className="bg-card rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
        <div className="relative h-64">
          <Image
            src={imageUrl}
            alt={name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <p className="text-primary mb-4">{role}</p>
          <p className="text-muted-foreground mb-4">{description}</p>
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsDetailModalOpen(true)}
          >
            了解更多
          </Button>
        </div>
      </div>
      <CharacterDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        name={name}
        role={role}
        description={description}
        imageUrl={imageUrl}
        skills={skills}
      />
    </>
  )
}

