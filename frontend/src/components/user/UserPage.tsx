'use client'

import UserDashBoard from './Dashboard'
import MyBookings from './MyBookings'
import Documents from './Documents'
import Settings from './Settings'
import Support from './Support'
import { useSearchParams } from 'next/navigation'

const UserPage = () => {

    const searchParams = useSearchParams()
    const currentTab = searchParams.get("tab") || "overview"
    console.log(currentTab)
    const renderPage = () => {
        switch (currentTab) {
            case "overview": return <UserDashBoard />;
            case "bookings": return <MyBookings />;
            case "documents": return <Documents />;
            case "setting": return <Settings />
            case "support": return <Support />
            default: return <UserDashBoard />;
        }
    }
    return (
        <h1 className='w-full'>
            {renderPage()}
        </h1>
    )
}

export default UserPage
