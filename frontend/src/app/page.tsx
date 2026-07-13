import AdminLayout from '@/components/admin/AdminLayout'
import AdminDashboard  from '@/components/admin/Dashboard'
import HomePage from '@/components/user/HomePage'
import VendorPage from '@/components/vendor/VendorPage'

const page = () => {
  const user = {
    role: "user"
  }
  return (
    <div >
      {user?.role === "user" ? (<HomePage />) : user?.role === "vendor" ? (<VendorPage />) : (<AdminLayout/>)}
    </div>
  )
}

export default page