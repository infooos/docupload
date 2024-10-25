import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <span className="text-blue-600">NextJS Supabase App</span>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by logging in or signing up
        </p>

        <div className="flex mt-6">
          <Link href="/login" passHref>
            <Button variant="outline" className="mr-4">Login</Button>
          </Link>
          <Link href="/signup" passHref>
            <Button>Sign Up</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}