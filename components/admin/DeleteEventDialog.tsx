'use client'

import { Button } from '@/components/common/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ADMIN } from '@/lib/constants/admin'
import type { EcellEvent } from '@/lib/types/event'

interface DeleteEventDialogProps {
  event: EcellEvent | null
  onClose: () => void
  onConfirm: (id: string) => void
}

export function DeleteEventDialog({ event, onClose, onConfirm }: DeleteEventDialogProps) {
  return (
    <Dialog open={event !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="rounded-none">
        <DialogHeader>
          <DialogTitle>{ADMIN.list.deleteTitle}</DialogTitle>
          <DialogDescription>
            {event ? (
              <>
                <span className="block font-medium text-midnight">{event.title}</span>
                <span className="mt-2 block">{ADMIN.list.deleteDescription}</span>
              </>
            ) : (
              ADMIN.list.deleteDescription
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            className="rounded-none border-2"
            onClick={onClose}
          >
            {ADMIN.list.deleteCancel}
          </Button>
          <Button
            className="rounded-none border-2 border-midnight bg-[#d92d20] text-paper hover:bg-[#d92d20]/90"
            onClick={() => {
              if (event) onConfirm(event.id)
            }}
          >
            {ADMIN.list.deleteConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
