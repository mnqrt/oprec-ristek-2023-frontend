"use state"
import axios from "axios"
import { getCookie } from "cookies-next"
import { useState } from "react"
import { EditSheet, PostWithUsername, User } from "./page"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Component1Icon, HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { DeleteDialog } from "./deleteDialog"
import { LikersDialog } from "./likersDialog"

interface PostComponentProps {
	post: PostWithUsername, 
	user: User, 
	currentLikers: string[] 
}

const dateMonthFormat = (date: Date) => {
	const dateObj = new Date(date);

	var options = { year: 'numeric', month: 'short', day: 'numeric' };
	const formattedDate = dateObj.toLocaleDateString('en-US', options as Intl.DateTimeFormatOptions);
	return formattedDate
}

export function PostComponent({ post, user, currentLikers }: PostComponentProps) {

	const [likers, setLikers] = useState(currentLikers)
	const [postText, setPostText] = useState(post.text)
	const [isDeleted, setIsDeleted] = useState(false)

	async function handleEdit( text: string ) {
		try {
			const currentToken = getCookie("ACCESS_TOKEN_USER")
			await axios.patch('http://localhost:4000/post/update-post', { postId: post._id, text }, {
				headers: {
					'Authorization': `Bearer ${currentToken}` 
				}
			})
			setPostText(text)
		}
		catch (error: unknown) {
			console.log("ERROR WHILE EDITING POST")
		}
	}

	async function handleLike() {
		if ( likers.includes(user.username) ) setLikers(likers.filter(userLike => userLike !== user.username))
		else setLikers([...likers, user.username])

		const currentToken = getCookie("ACCESS_TOKEN_USER")
		await axios.patch('http://localhost:4000/post/update-like', { postId: post._id }, {
			headers: {
				'Authorization': `Bearer ${currentToken}` 
			}
		})

		console.log("BERHASIL")
	}

	async function handleDelete() {
		try {
			const currentToken = getCookie("ACCESS_TOKEN_USER")
			await axios.delete('http://localhost:4000/post/delete-post', {
				headers: {
					'Authorization': `Bearer ${currentToken}` 
				},
				data: {
					postId: post._id
				}
			})
			setIsDeleted(true)
		}
		catch (error: unknown) {
			console.log("ERROR WHILE DELETING POST")
		}
	}

	if (isDeleted) return null

	return (
	<div>
		<Card className="">
			<CardHeader>
				{post.isCloseFriend ? 
					<div className="flex justify-start"><TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full overflow-hidden">
									<Component1Icon className="invert" />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>This post is for close friend only. {":)"}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider></div>: null}
				<CardDescription>{post.postedUsername}</CardDescription>
			</CardHeader>
			<CardContent className="flex justify-between">
				<p>{postText}</p>
				{post.postedUsername == user.username ?
					<div className="flex justify-center gap-4">
							<EditSheet post={post} onEdit={handleEdit}/>
							<DeleteDialog  onDelete={handleDelete}/>
					</div>
				: null}
			</CardContent>
			<CardFooter className="flex justify-between">
					<p>{dateMonthFormat(post.dateAdded)}</p>
					<div className="flex justify-center">
						{likers.includes(user.username) ? <HeartFilledIcon onClick={handleLike}/> : <HeartIcon onClick={handleLike}/>}
						<LikersDialog likers={likers}/>
					</div>
			</CardFooter>
		</Card>
		<Separator />
	</div>)
}