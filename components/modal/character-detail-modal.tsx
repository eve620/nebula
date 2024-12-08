'use client'

import { Modal } from "@/components/modal/modal"
import { Progress } from "@/components/ui/progress"
import Image from 'next/image'

interface Skill {
  name: string
  description: string
  power: number
}

interface CharacterDetailModalProps {
  isOpen: boolean
  onClose: () => void
  name: string
  role: string
  description: string
  imageUrl: string
  skills: Skill[]
}

export function CharacterDetailModal({
  isOpen,
  onClose,
  name,
  role,
  description,
  imageUrl,
  skills
}: CharacterDetailModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={name}>
      <div className="sm:max-w-[425px]">
        <div>
          <div className="grid gap-4">
            <div className="relative w-full h-64">
              <Image
                src={imageUrl}
                alt={name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{role}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-2">技能</h4>
              {skills.map((skill, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.power}%</span>
                  </div>
                  <Progress value={skill.power} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

