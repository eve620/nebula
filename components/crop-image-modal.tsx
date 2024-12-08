'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Modal } from '@/components/ui/modal'
import Cropper from 'react-easy-crop'
import { Point, Area } from 'react-easy-crop/types'

interface CropImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  onCropComplete: (croppedImage: string) => void
}

export function CropImageModal({ isOpen, onClose, imageUrl, onCropComplete }: CropImageModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = useCallback(async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels)
      onCropComplete(croppedImage)
      onClose()
    }
  }, [imageUrl, croppedAreaPixels, onCropComplete, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="裁剪图片" description="调整图片大小和位置">
      <div className="relative w-full h-64 mt-4">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={setZoom}
        />
      </div>
      <div className="flex justify-between mt-4">
        <Button onClick={onClose} variant="outline">取消</Button>
        <Button onClick={handleSave}>保存</Button>
      </div>
    </Modal>
  )
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'))
        return
      }
      resolve(URL.createObjectURL(blob))
    }, 'image/jpeg')
  })
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })
}

