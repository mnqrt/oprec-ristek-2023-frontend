import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
	Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { GlobeIcon } from "lucide-react"
import { StarFilledIcon } from "@radix-ui/react-icons"
import { User } from "./page"
import { Textarea } from "@/components/ui/textarea"
import { getCookie } from "cookies-next"
import axios from "axios"
import { CloseFriendDialog } from "./closeFriendDialog"

interface FormPostProps {
	user: User
	fetchPosts: () => Promise<void>
}


export default function FormPost({ user, fetchPosts }: FormPostProps) {
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

		async function onSubmit(data: z.infer<typeof FormSchema>, isCloseFriend: boolean) {
			try{
				console.log(data.text)
				const currentToken = getCookie('ACCESS_TOKEN_USER')
				await axios.post('http://localhost:4000/post/create-post', { text: data.text, isCloseFriend }, {
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

		const form = useForm<z.infer<typeof FormSchema>>({
			resolver: zodResolver(FormSchema),
		})
    return <div className="w-full">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(event => console.log(event))} className="w-full space-y-6 m-2">
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
					<div className="flex justify-start gap-4">
						<Button type="submit" onClick={() => onSubmit(form.getValues(), false)} className="flex justify-center gap-1">
							<GlobeIcon/> 
							Public
						</Button>
						<Button type="submit" onClick={() => onSubmit(form.getValues(), true)} className="bg-green-500 hover:bg-green-400 flex justify-center gap-1">
							<StarFilledIcon/> 
							Close Friend
						</Button>
						<CloseFriendDialog userNow={user} />
					</div>
				</form>
			</Form>
		</div>
}