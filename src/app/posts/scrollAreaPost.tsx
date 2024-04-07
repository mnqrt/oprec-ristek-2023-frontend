import { ScrollArea } from "@/components/ui/scroll-area"
import { PostComponent } from "./onePost"
import { PostWithUsername, User } from "./page"

interface ScrollAreaPostProps {
	posts: PostWithUsername[],
	user: User
}

export default function ScrollAreaPost({ posts, user }: ScrollAreaPostProps) {
  return  (
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
	</ScrollArea>)
}