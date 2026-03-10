'use client'

import { useState } from 'react'
import Image from 'next/image'
import { api } from '@/lib/axiosInstance'
import { Loader2, GripVertical } from 'lucide-react'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export interface UploadedImage {
  url: string
  id: string
  position: number
}

// ─── Sortable thumbnail ───────────────────────────────────────────────────────

function SortableImage({
  img,
  index,
  onRemove,
}: {
  img: UploadedImage
  index: number
  onRemove: (index: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: img.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group"
    >
      <Image
        src={img.url}
        alt={`Preview ${index + 1}`}
        fill
        className="object-cover pointer-events-none"
      />

      {/* Position badge */}
      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] font-semibold rounded px-1 leading-4">
        #{img.position + 1}
      </div>

      {/* Drag handle */}
      <button
        type="button"
        className="absolute top-1 left-1 bg-black/50 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="w-3 h-3" />
      </button>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-500 transition-colors"
      >
        ✕
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ImageUploadProps {
  value: UploadedImage | UploadedImage[] | null
  onChange: (value: UploadedImage | UploadedImage[]) => void
  multiple?: boolean
  maxFiles?: number
}

export default function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const images: UploadedImage[] = multiple
    ? (value as UploadedImage[]) ?? []
    : value
      ? [value as UploadedImage]
      : []

  const sortedImages = [...images].sort((a, b) => a.position - b.position)

  const sensors = useSensors(useSensor(PointerSensor))

  // ── Upload ──────────────────────────────────────────────────────────────────

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    if (multiple && images.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`)
      return
    }

    setUploading(true)
    try {
      const uploads = Array.from(files).map(async (file, i) => {
        const form = new FormData()
        form.append('image', file)
        const res = await api.post('/upload', form)
        return {
          url: res.data.data.url,
          id: res.data.data.public_id,
          position: images.length + i,
        } as UploadedImage
      })

      const uploaded = await Promise.all(uploads)
      onChange(multiple ? [...images, ...uploaded] : uploaded[0])
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  // ── Remove ──────────────────────────────────────────────────────────────────

  const removeImage = (index: number) => {
    const updated = sortedImages
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, position: i }))
    onChange(multiple ? updated : null!)
  }

  // ── Reorder via dnd-kit ─────────────────────────────────────────────────────

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sortedImages.findIndex((img) => img.id === active.id)
    const newIndex = sortedImages.findIndex((img) => img.id === over.id)

    const reordered = arrayMove(sortedImages, oldIndex, newIndex).map(
      (img, i) => ({ ...img, position: i })
    )

    onChange(multiple ? reordered : reordered[0])
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">
      {/* Upload dropzone */}
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleUpload(e.target.files)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm">Uploading image...</p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Click or drag image here</p>
        )}
      </div>

      {/* Sortable previews */}
      {sortedImages.length > 0 && (
        <>
          {multiple && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              Drag <GripVertical className="w-3 h-3" /> handle to reorder
            </p>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedImages.map((img) => img.id)}
              strategy={rectSortingStrategy}
            >
              <div className="flex gap-3 flex-wrap">
                {sortedImages.map((img, index) => (
                  <SortableImage
                    key={img.id}
                    img={img}
                    index={index}
                    onRemove={removeImage}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  )
}