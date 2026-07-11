'use client'

import UserDashBoard from './Dashboard'
import MyBookings from './MyBookings'
import Documents from './Documents'
import Settings from './Settings'
import Support from './Support'
import { useSearchParams } from 'next/navigation'
import Profile from './Profile'
import CustomerSettingsLayout from './Settings'
import PaymentHistoryPage from './Payment'

const UserPage = () => {

    const searchParams = useSearchParams()
    const currentTab = searchParams.get("tab") || "overview"
    console.log(currentTab)
    const renderPage = () => {
        switch (currentTab) {
            case "overview": return <UserDashBoard />;
            case "bookings": return <MyBookings />;
            case "documents": return <Documents />;
            case "profile-settings": return <Profile />
            case "support": return <Support />
            case "settings": return <CustomerSettingsLayout />
            case "payment" : return <PaymentHistoryPage/>
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
