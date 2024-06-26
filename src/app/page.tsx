'use client'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Axis3DIcon } from 'lucide-react'
import { useEffect } from 'react'
import axios from 'axios'
import { redirect, useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuthorized = async() => {
      try {
        const response = await axios.get('http://localhost:4000/auth/get-current-user', {withCredentials: true})
        console.log(response)
      }  
      catch (error: unknown) {
        router.push('/login')
      }
    }
    checkAuthorized()
  }, [])

  return (
    <main className="p-12">
      <Navbar />
      <section className='py-12 flex flex-col items-center text-center gap-8'>
        <h1 className='text-4xl font-bold'>Homepage</h1>
        <p className='text-4xl text-muted-foreground'>-</p>
      </section>
    </main>
  )
}