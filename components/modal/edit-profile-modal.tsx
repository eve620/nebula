'use client'

import {useState, useRef, useEffect} from 'react'
import Image from 'next/image'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Modal} from '@/components/modal/modal'
import {CropImageModal} from './crop-image-modal'
import {Textarea} from "@/components/ui/textarea"
import {useUser} from "@/contexts/user-context";
import showMessage from "@/components/message";
import {useRouter} from "next/navigation";

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
}

export function EditProfileModal({isOpen, onClose}: EditProfileModalProps) {
    const currentUser = useUser()
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null)
    const [isCropModalOpen, setIsCropModalOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isChangePassword, setIsChangePassword] = useState(false)

    const [bio, setBio] = useState(currentUser?.bio || '')
    const [nickname, setNickname] = useState(currentUser?.nickname || '')
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const router = useRouter()
    useEffect(() => {
        if (isOpen) {
            setBio(currentUser?.bio || '');
            setNickname(currentUser?.nickname || '');
            setCroppedImage(null)
            setSelectedFile(null)
            setOldPassword("")
            setNewPassword("")
            setIsChangePassword(false)
        }
    }, [isOpen, currentUser]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
                setIsCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelectImage = () => {
        fileInputRef.current?.click()
    }

    const handleCropComplete = (croppedImage) => {
        setSelectedFile(croppedImage)
        const croppedImageUrl = URL.createObjectURL(croppedImage)
        setCroppedImage(croppedImageUrl)
        setIsCropModalOpen(false)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('username', currentUser?.username || "")
        formData.append('nickname', nickname || "")
        formData.append('bio', bio || "")
        if(selectedFile){
            formData.append('image', selectedFile)
        }
        if (isChangePassword) {
            formData.append('oldPassword', oldPassword)
            formData.append('newPassword', newPassword)
        }
        const request = await fetch('/api/user', {
            method: 'PUT',
            body: formData as BodyInit
        })
        const res = await request.json()
        if (request.ok) {
            onClose()
            router.refresh()
            showMessage("保存成功！")
        } else {
            showMessage(res.error)
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="编辑个人资料" description="更新您的用户名和头像">
                <form className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="avatar" className="text-right">
                            头像
                        </Label>
                        <div className="col-span-3 mx-auto">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{display: 'none'}}
                            />
                            <div className="relative w-32 h-32 cursor-pointer" onClick={handleSelectImage}>
                                <Image
                                    src={croppedImage || currentUser?.image || "/avatar.png"}
                                    alt="Cropped avatar"
                                    fill
                                    objectFit="cover"
                                    className="rounded-full outline outline-2 outline-foreground"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            用户名
                        </Label>
                        <Input
                            id="username"
                            value={currentUser?.username}
                            disabled
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
                        <Label htmlFor="nickname" className="text-right">
                            密码
                        </Label>
                        <div className="col-span-3">
                            <div className={isChangePassword ? 'block' : 'hidden'}>
                                <Input
                                    placeholder="请输入旧密码..."
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full mb-2"
                                    id="oldPassword"
                                />
                                <Input
                                    placeholder="请输入新密码..."
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full mb-2"
                                    id="newPassword"
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={() => {
                                    setNewPassword("")
                                    setOldPassword("")
                                    setIsChangePassword(!isChangePassword)
                                }}
                            >
                                {isChangePassword ? '取消修改' : '修改密码'}
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            介绍
                        </Label>
                        <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="col-span-3 max-h-28"
                        />
                    </div>
                    <div className="flex justify-between">
                        <Button type={"button"} onClick={onClose} variant="outline">取消</Button>
                        <Button type={"submit"} onClick={handleSave}>保存</Button>
                    </div>
                </form>
            </Modal>
            {previewUrl && (
                <CropImageModal
                    isOpen={isCropModalOpen}
                    onClose={() => setIsCropModalOpen(false)}
                    imageUrl={previewUrl}
                    onCropComplete={handleCropComplete}
                />
            )}
        </>
    )
}

