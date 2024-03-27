'use client'
import UserProfile from "./UserProfile"

export default function Sidebar() {
    return <div className="flex flex-col w-[300px] min-w-[300px] border-r-4 min-h-screen p-4"> 
    <div>
        <UserProfile />
    </div>
    <div className="grow"> Events </div>
    </div>
}