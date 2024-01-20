"use client"
import * as React from "react"
import * as z from "zod"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { redirect, useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { IconButton, Select } from "@material-tailwind/react"
import { HeartIcon, HeartFilledIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import Navbar from "@/components/Navbar"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"



const FormSchema = z.object({
  text: z
    .string()
    .min(10, {
      message: "Text must be at least 10 characters.",
    })
    .max(160, {
      message: "Text must not be longer than 160 characters.",
    }),
})


interface Post {
	_id: string,
	text: string,
	dateAdded: Date,
	postedUser: string,
	likers: string[],
}

interface PostWithUsername extends Post {
	username: string,
	likersUsername: string[]
}

interface User {
	_id: string,
	username: string
}

const dateMonthFormat = (date: Date) => {
	const dateObj = new Date(date);

	var options = { year: 'numeric', month: 'short', day: 'numeric' };
	const formattedDate = dateObj.toLocaleDateString('en-US', options as Intl.DateTimeFormatOptions);
	return formattedDate
}

export function EditSheet({ post, onEdit }: { post: PostWithUsername, onEdit: any}){
		const [text, setText] = useState(post.text)

		return (<Sheet>
			<SheetTrigger asChild>
				<Pencil2Icon/>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit Post</SheetTitle>
					<SheetDescription>
						Make changes to your post here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="text" className="text-right">
							Text
						</Label>
						<Textarea id="text" value={text} onChange={(event) => setText(event.target.value)} className="col-span-3" />
					</div>
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button onClick={async () => await onEdit(text)}>Save changes</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>)
}

export function LikersDialog({ likers }: { likers: string[] }) {
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

export function DeleteDialog({ onDelete }: { onDelete: any }) {
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

export function PostComponent({ post, user, currentLikers }: 
		{ post: PostWithUsername, user: User, currentLikers: string[] }) {

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

	return (<div key={post._id}>
		<Card className="">
			<CardHeader>
				<CardDescription>{post.username}</CardDescription>
			</CardHeader>
			<CardContent className="flex justify-between">
				<p>{postText}</p>
				{post.username == user.username ?
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

export default function Posts() {
	const [posts, setPosts] = useState([])
	const [user, setUser] = useState({_id: "", username: ""} as User)
	const router = useRouter()

	const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
	})

  async function onSubmit(data: z.infer<typeof FormSchema>) {
		try{
			console.log(data.text)
			const currentToken = getCookie('ACCESS_TOKEN_USER')
			await axios.post('http://localhost:4000/post/create-post', { text: data.text }, {
				headers: {
					'Authorization': `Bearer ${currentToken}` 
				}
			})
			fetchPosts()
		}
		catch (error: unknown) {
			console.log("EROR WHILE CREATING POST")
		}
  }

	const fetchPosts = async () => {
		try {
			const currentToken = getCookie('ACCESS_TOKEN_USER')
			const response = await axios.get('http://localhost:4000/post/get-all', {
				headers: {
					'Authorization': `Bearer ${currentToken}` 
				}
			})
			const updatedPosts = (await Promise.all(response.data.map(async (post: Post) => {
				const likersUsername = (await Promise.all(post.likers.map(async (userId: string) => (await getUsername(userId)))))
				const username = await getUsername(post.postedUser)
				console.log(`${post.text}: ${username} | ${likersUsername}`)
				return {...post, username, likersUsername} as PostWithUsername
			}))).reverse()

			console.log(updatedPosts)
			setPosts(updatedPosts  as React.SetStateAction<never[]>)
		}  
		catch (error: unknown) {
			router.push('/login')
		}
	}

	const getUsername = async (id: string) =>{
		const response = await axios.get('http://localhost:4000/auth/get-username-from-id', { params: { id } })
		return response.data.username;
	}


	useEffect(() => {
		const checkAuthorized = async () => {
			try {
				const response = await axios.get('http://localhost:4000/auth/get-current-user', {withCredentials: true})
				console.log("USER "+JSON.stringify(response.data))
				setUser({ _id: response.data._id, username: response.data.username})
			}  
			catch (error: unknown) {
				router.push('/login')
			}
		}

		document.body.style.overflow = 'hidden';
		checkAuthorized()
		fetchPosts()
		document.body.style.overflow = '';
	}, [])

	return (
		<div className="h-screen flex flex-col p-12">
			<Navbar />

			<div className="flex overflow-y-scroll">
				<div className="flex flex-col w-1/4 justify-between h-full">
					<div>
						<div>Home</div>
						<div>Search</div>
						<div>Notification</div>
					</div>
					<div className="">
						<div>Profile</div>
					</div>
				</div>

				<div className="p-4 w-3/4 gap-2">

					<div className="w-full">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 m-2">
								<FormField
									control={form.control}
									name="text"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Write Your Thoughts</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Tell us Anything"
													className="resize-none"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Don't worry, this is a safe place for you :)
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit">Submit</Button>
							</form>
						</Form>
					</div>

					<ScrollArea className="w-full rounded-md border h-full">
						<div className="h-full">
							<h4 className="mb-4 text-lg font-medium leading-none p-2">All Posts</h4>
							{posts.map((post: PostWithUsername) => {
								return <PostComponent 
									post={post} 
									user={user}
									currentLikers={post.likersUsername}
									key={post._id}
								/>
							})}
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>

	)
}
