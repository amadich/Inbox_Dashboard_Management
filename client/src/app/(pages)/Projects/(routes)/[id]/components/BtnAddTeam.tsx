"use client";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";


export default function BtnAddTeam({ projectId }: { projectId: string }) {
  const userInfo = TokenInfoUser();
  const hasAccess = userInfo?.role === "MANAGER" || userInfo?.role === "ADMIN" 
      ? true 
      : false
  
  
  return (
    <>
      {
        hasAccess ? (
          <Link href={`/Projects/${projectId}/AddTeam`}> 
                     <button className=" flex items-center p-2 space-x-2  rounded-md font-semibold bg-slate-200 text-black border text-xs duration-150 hover:bg-slate-100 ">
                        <UserPlusIcon className="h-5 w-5" />
                        <span>إضافة أعضاء الفريق</span>
                     </button>
      </Link>
        ) :null
      }
    </>
  )
}
