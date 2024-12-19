import {Button} from "@/components/ui/button"
import {FileIcon, PlusIcon} from 'lucide-react'

interface EmptyStateProps {
    title: string
    description: string
    actionLabel: string
    onAction: () => void
}

export function EmptyState({title, description, actionLabel, onAction}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center px-4">
            <div className="bg-muted rounded-full p-6 mb-6">
                <FileIcon className="w-12 h-12 text-muted-foreground"/>
            </div>
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
            <Button onClick={onAction}>
                <PlusIcon className="mr-2 h-4 w-4"/> {actionLabel}
            </Button>
        </div>
    )
}

