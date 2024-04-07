"use client"
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { redirect } from 'next/navigation'
import { Button } from "@/components/ui/button"
import axios, { AxiosError } from 'axios'
import {
Form,
FormControl,
FormDescription,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from '@/components/ui/use-toast'
import { setCookie, getCookie, deleteCookie } from "cookies-next";

const formSchema = z.object({
  username: z.string().min(2).max(50),
	password: z.string()
})

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()

	const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
			password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      const res = await axios.post(`http://localhost:4000/auth/login`,{
        username: values.username,
        password: values.password
      })
      console.log("INI RESPONSE "+JSON.stringify(res.data))
      console.log("-------> "+document.cookie)
      setCookie('ACCESS_TOKEN_USER', res.data.accessToken)
      setCookie('REFRESH_TOKEN_USER', res.data.refreshToken)
      console.log("--> "+document.cookie)
      router.push('/')
      
    }
    catch (error: unknown) {
      if (error instanceof AxiosError){
        switch (error.response?.status) {
          case 404:
            toast({
              description: `No User with username ${values.username}.`
            });
            break;
          case 401:
            toast({
              description: `Password Incorrect.`
            });
            break;
          default:
            toast({
              description: `Aneh ajg`
            });
            break;
        }
      }
    }
  }

  return (
    <main className="p-12">
      <Navbar />
      <section className='py-12 flex flex-col items-center text-center gap-8'>
        <h1 className='text-4xl font-bold'>Login</h1>
        <p className='text-4xl text-muted-foreground'>Enter Your Credential Here.</p>
      </section>
      <div className='flex flex-col items-center justify-center '>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border-muted border-2 p-2 rounded-lg">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="adrian" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display username.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="halo123" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit">Submit</Button>
          </form>
				</Form>

        <Button variant={'ghost'} onClick={async () => await axios.delete('http://localhost:4000/auth/delete-tokens')}>Delete token</Button>
      </div>
    </main>
  )
}
