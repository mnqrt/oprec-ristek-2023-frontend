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
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
	HeartIcon, 
	HeartFilledIcon, 
	Pencil2Icon, 
	TrashIcon, 
	GlobeIcon, 
	StarFilledIcon, 
	Component1Icon, 
	AccessibilityIcon, 
	PersonIcon 
} from '@radix-ui/react-icons'
import FormPost from "./formPost"
import ScrollAreaPost from "./scrollAreaPost"
import SidebarPost from "./sidebarPost"



interface Post {
	_id: string,
	text: string,
	dateAdded: Date,
	postedUser: string,
	likers: string[],
}

export interface PostWithUsername extends Post {
	postedUsername: string,
	likersUsername: string[],
	isCloseFriend: boolean
}

export interface User {
	_id: string,
	username: string
}

interface CloseFriend {
	_id: string,
	userId: string,
	listCFAdded: string[],
	listCFAddedUsername: string[],
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

export default function Posts() {
	const [posts, setPosts] = useState([])
	const [user, setUser] = useState({_id: "", username: ""} as User)
	const router = useRouter()

	const fetchPosts = async () => {
		try {
			const currentToken = getCookie('ACCESS_TOKEN_USER')
			const response = await axios.get('http://localhost:4000/post/get-all', {
				headers: {
					'Authorization': `Bearer ${currentToken}` 
				}
			})
			const updatedPosts = (response.data.reverse() as PostWithUsername)

			console.log("POST --> "+JSON.stringify(updatedPosts))
			setPosts(updatedPosts as unknown as React.SetStateAction<never[]>)
		}  
		catch (error: unknown) {
			router.push('/login')
		}
	}

	useEffect(() => {
		const checkAuthorized = async () => {
			try {
				const response = await axios.get('http://localhost:4000/auth/get-current-user', {withCredentials: true})
				console.log("USER "+JSON.stringify(response.data))
				setUser({ _id: response.data._id, username: response.data.username} as User)
			}  
			catch (error: unknown) {
				router.push('/login')
			}
		}
		checkAuthorized()
		fetchPosts()
		document.body.style.overflow = '';
	}, [])

	return (
		<div className="h-screen flex flex-col p-12">
			<Navbar />
			<div className="flex overflow-y-scroll">
				<SidebarPost />
				<div className="p-4 w-3/4 gap-2">
					<FormPost user={user} fetchPosts={fetchPosts} />
					<ScrollAreaPost user={user} posts={posts} />
				</div>
			</div>
		</div>
	)
}