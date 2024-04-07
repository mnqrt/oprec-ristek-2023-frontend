"use client"
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "./page";
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
import { Button } from "@/components/ui/button";
import { PersonIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox";

interface CloseFriendDialogProps {
	userNow: User
}

export function CloseFriendDialog({ userNow }: CloseFriendDialogProps) {
	const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
	const [listCloseFriend, setListCloseFriend] = useState<string[]>();
	const [users, setUsers] = useState<User[]>();

	async function getListCloseFriend() {
		const currentToken = getCookie("ACCESS_TOKEN_USER")
		const response = await axios.get('http://localhost:4000/close-friend/get-close-friend', {
			headers: {
				'Authorization': `Bearer ${currentToken}`
			}
		})
		const cleanedCloseFriendData = response.data.listCFAdded
		setListCloseFriend(cleanedCloseFriendData)
	}

	useEffect(() => {

		async function getUsers() {
			const currentToken = getCookie("ACCESS_TOKEN_USER")
			const response = await axios.get('http://localhost:4000/auth/get-users', {
				headers: {
					'Authorization': `Bearer ${currentToken}`
				}
			})
			const cleanedUserData = (response.data as User[]).map(currentUser => ({_id: currentUser._id, username: currentUser.username} as User))
																											.filter(currentUser => currentUser.username !== userNow.username)
			console.log("--> "+JSON.stringify(cleanedUserData))
			console.log("AWAL "+currentToken)
			console.log(userNow.username)
			setUsers(cleanedUserData)
		}

		getListCloseFriend()
		getUsers()
	}, [userNow])

	var form = useForm({})

  async function onSubmitCloseFriend(data: any) {
		if (! users)return;

		const currentToken = getCookie("ACCESS_TOKEN_USER")
		for (const user of users) {
			const userId = user._id;
			if (data.users.includes(userId) === listCloseFriend?.includes(userId)) continue 
			await axios.patch('http://localhost:4000/close-friend/update-close-friend', { updatedUserId: userId }, {
				headers: {
					'Authorization': `Bearer ${currentToken}`
				}
			})
		}
		getListCloseFriend()

		setTimeout(() => {
			setDialogOpen(false);
		}, 100);
  }

	return <Dialog open={isDialogOpen}>
		<DialogTrigger asChild>
			<Button className="bg-fuchsia-400 hover:bg-fuchsia-400 hover:brightness-105 flex justify-center gap-1" onClick={() => {setDialogOpen(true)}}>
				<PersonIcon/> Manage Close Friend
			</Button>
		</DialogTrigger>
		<DialogContent className="sm:max-w-[425px] bg-fuchsia-50">
			<DialogHeader>
				<DialogTitle>Close Friend</DialogTitle>
				<DialogDescription>
					Manage who can see your special post.
				</DialogDescription>
			</DialogHeader>
			<ScrollArea className="w-fill rounded-md">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmitCloseFriend)} className="space-y-8">
						<Separator/>
						<FormField
							control={form.control}
							name="users"
							render={() => (
								<FormItem>
									{users ? users.map((currentUser, index) => (
										<div>
											<FormField
												key={currentUser._id}
												control={form.control}
												name="users"
												render={({ field }) => {
													return (
														<FormItem
															key={currentUser._id}
															className="flex flex-row items-start space-x-3 space-y-0 mb-2"
														>
															<FormControl>
																<Checkbox
																	checked={field.value?.includes(currentUser._id)}
																	onCheckedChange={(checked) => {
																		return checked
																			? field.onChange(field.value ? [...field.value, currentUser._id] : [currentUser._id])
																			: field.onChange(
																					field.value?.filter(
																						(value) => value !== currentUser._id
																					)
																				)
																	}} 
																/>
															</FormControl>
															<FormLabel className="font-medium">
																{currentUser.username} {listCloseFriend?.includes(currentUser._id) ? "(Close Friend)" : ""}
															</FormLabel>
														</FormItem>
													)
												}}
											/>
											{ index !== users.length - 1 ? <Separator/> : null }
										</div>
									)) : null}
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Submit</Button>
					</form>
				</Form>
			</ScrollArea>
			<DialogFooter className="sm:justify-start">
				<DialogClose asChild>
					<Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
						Close
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	</Dialog>
}
