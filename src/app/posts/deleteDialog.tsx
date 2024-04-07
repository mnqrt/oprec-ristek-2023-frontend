import { Button } from "@/components/ui/button"
import {
	Dialog,
  DialogContent,
	DialogClose,
  DialogDescription,
	DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TrashIcon } from "@radix-ui/react-icons"

interface DeleteDialogProps {
	onDelete: () => Promise<void>
}

export function DeleteDialog({ onDelete }: DeleteDialogProps) {
	return <Dialog>
		<DialogTrigger asChild>
			<TrashIcon/>
		</DialogTrigger>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Are you absolutely sure?</DialogTitle>
				<DialogDescription>
					This action cannot be undone. Are you sure you want to permanently
					delete this file from our servers?
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button type="submit" onClick={onDelete}>Confirm</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
}