import AdminDashboard from '@/components/admin/Dashboard'
import Footer from '@/components/footer/Footer'
import Navbar from '@/components/navbar/Navbar'
import JourneyAndReviews from '@/components/reviews/JourneyAndReviews'
import UserDashBoard from '@/components/user/Dashboard'
import HomePage from '@/components/user/HomePage'
import UserPage from '@/components/user/UserPage'
import VendorDashboard from '@/components/vendor/Dashboard'
import React from 'react'

const page = () => {
  const user = {
    role:"user"
  }
  return (
    <div >
      {/* <Navbar /> */}
      {user?.role === "user" ? (<HomePage />) : user?.role === "vendor" ? (<VendorDashboard  />) : (<AdminDashboard />)}
      {/* <JourneyAndReviews/>
      <Footer /> */}
    </div>
  )
}

export default page

// className='flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 font-sans flex-col'