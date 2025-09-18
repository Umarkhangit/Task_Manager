'use client'

import { CircleUserRound, LogIn, LogOut } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator"
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton"

const Userprofile = () => {

    const router = useRouter()

    const signOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onError: (ctx) => {
                    toast(ctx.error.message)
                },
                onSuccess: () => {
                    router.push("/signin")
                }
            }
        })
    }

    const { data: session, isPending } = authClient.useSession()
    // console.log(isPending)
    console.log(session?.user?.name)
    if(isPending) return <Skeleton className='h-6 w-6 rounded-full'/>
    
    const profile  = session?.user?.name

    return (
        <Popover>
            <PopoverTrigger asChild>
                <CircleUserRound className="text-blue-500 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent>
                <div className="grid gap-2">
                    {profile&&<h3>{profile}</h3>}
                    <Link href="/signin" className="flex items-center p-1 rounded-sm hover:bg-gray-200 sm:text-md sm:p-2"><LogIn className="mr-3" /> Sign In</Link>
                    <Separator />
                    <div className="flex items-center text-red-500  p-1 cursor-pointer rounded-sm hover:bg-gray-200 sm:text-md sm:p-2" onClick={signOut}><LogOut className="mr-3" /> Sign Out</div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default Userprofile