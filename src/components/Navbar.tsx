"use client";
import Image from "next/image";
import { ModeToggle } from "./ui/toggle-mode";
import { useCookies } from "react-cookie";
import axios from "axios";
import { User, LogOut } from 'lucide-react'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useRouter } from 'next/navigation'

interface User {
		username: string,
		password: string
};

interface DropdownNavbarProps {
	username: string;
}

function DropdownNavbar({ username } : DropdownNavbarProps) {
	const router = useRouter()

	async function handleLogout() {
		await axios.delete('http://localhost:4000/auth/logout', {withCredentials: true})
		deleteCookie('ACCESS_TOKEN_USER')
		deleteCookie('REFRESH_TOKEN_USER')
		console.log("------------------------------------")
		router.push('/login')
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">{username}</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
						<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>
					<LogOut className="mr-2 h-4 w-4"/>
					<span>Log out</span>
					<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}


export default function Navbar() {
	const [username, setUsername] = useState('')

	useEffect(() => {
		async function getUser(){
			try {
				const response = await axios.get('http://localhost:4000/auth/get-current-user', {withCredentials: true})
				setUsername(response.data.username)
			}
			catch (error) {
				console.log(error)
			}
		}
		getUser()
	}, [])

	return (
		<header>
			<nav>
				<ul className="flex items-center justify-between">
					<li>
						<a
						className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
						href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
						>
						By{' '}
						<Image
								src="/vercel.svg"
								alt="Vercel Logo"
								className="dark:invert"
								width={100}
								height={24}
								priority
						/>
						</a>
					</li>
					<li>
						<div>
							{username === ''
								? <ModeToggle></ModeToggle>	
								: <><DropdownNavbar username={username}></DropdownNavbar> <ModeToggle></ModeToggle></>}
						</div>
					</li>
				</ul>
			</nav>
		</header>
	);
}

//npm i