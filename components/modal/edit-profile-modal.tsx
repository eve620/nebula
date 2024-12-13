'use client'

import {useState, useCallback, useRef} from 'react'
import Image from 'next/image'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Modal} from '@/components/modal/modal'
import {CropImageModal} from './crop-image-modal'
import {Textarea} from "@/components/ui/textarea"
import {User} from "@/types";

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
    user: User
}

export function EditProfileModal({isOpen, onClose, user}: EditProfileModalProps) {
    const [username, setUsername] = useState(user.username || '')
    const [bio, setBio] = useState(user.bio || '')
    const [nickname, setNickname] = useState(user.nickname || '')
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [croppedImage, setCroppedImage] = useState<string | null>(null)
    const [isCropModalOpen, setIsCropModalOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setSelectedImage(reader.result as string)
                setIsCropModalOpen(true)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSelectImage = () => {
        fileInputRef.current?.click()
    }

    const handleCropComplete = (croppedImageUrl: string) => {
        setCroppedImage(croppedImageUrl)
        setIsCropModalOpen(false)
    }

    const handleSave = useCallback(() => {
        onClose()
    }, [username, nickname, bio, croppedImage, onClose])

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="编辑个人资料" description="更新您的用户名和头像">
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            用户名
                        </Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nickname" className="text-right">
                            昵称
                        </Label>
                        <Input
                            id="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            描述
                        </Label>
                        <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <Button onClick={handleSelectImage} type="button">
                            选择图片
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{display: 'none'}}
                        />
                        {croppedImage && (
                            <div className="relative w-32 h-32">
                                <Image
                                    src={croppedImage}
                                    alt="Cropped avatar"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-full"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between">
                        <Button onClick={onClose} variant="outline">取消</Button>
                        <Button onClick={handleSave}>保存</Button>
                    </div>
                </div>
            </Modal>
            {selectedImage && (
                <CropImageModal
                    isOpen={isCropModalOpen}
                    onClose={() => setIsCropModalOpen(false)}
                    imageUrl={selectedImage}
                    onCropComplete={handleCropComplete}
                />
            )}
        </>
    )
}

