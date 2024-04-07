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
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import React from "react"

interface LikersDialogProps {
	likers: string[] 
}

export function LikersDialog({ likers }: LikersDialogProps) {
	return <Dialog>
		<DialogTrigger asChild>
			<Button variant="link">{likers.length}</Button>
		</DialogTrigger>
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Admirers Gallery</DialogTitle>
				<DialogDescription>
					Users who like this amazing post.
				</DialogDescription>
			</DialogHeader>
			<ScrollArea className="w-fill rounded-md border">
				<div className="p-4">
					{likers.length > 0 ? likers.map((username: string, index) => (
						<React.Fragment key={username}>
							{index ? <Separator className="my-2" /> : null}
							<div className="text-sm">
								{username}
							</div>
						</React.Fragment>
					)) : "It seems that nobody has liked this post :("}
				</div>
			</ScrollArea>
			<DialogFooter className="sm:justify-start">
				<DialogClose asChild>
					<Button type="button" variant="secondary">
						Close
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	</Dialog>
}