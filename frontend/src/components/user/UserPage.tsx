'use client'

import UserDashBoard from './Dashboard'
import MyBookings from './MyBookings'
import Documents from './Documents'
import Support from './Support'
import Profile from './Profile'
import CustomerSettingsLayout from './Settings'
import PaymentHistoryPage from './Payment'
import { useSearchParams } from 'next/navigation'
import HowItWorksSteps from '../navbar/user/HowItsWork'
import ContactUs from '../navbar/user/ContectUs'
import AboutUs from '../navbar/user/Aboutus'
import FAQ from '../navbar/user/FAQs'
import PrivacyPolicy from '../navbar/user/PrivacyPolicy'
import TermsAndConditions from '../navbar/user/TermsAndConditions' // Import your Terms component
import ServicesPage from '../navbar/user/Services'

const UserPage = () => {
    const searchParams = useSearchParams()

    // Check both 'nav' (Navbar) and 'tab' (Sidebar)
    const currentNav = searchParams.get("nav")
    const currentTab = searchParams.get("tab") || "overview"

    const renderPage = () => {
        // Priority 1: Render Navbar sections if 'nav' parameter is set
        if (currentNav) {
            switch (currentNav) {
                case "how-it-works":
                    return <HowItWorksSteps />;
                case "services":
                    return <ServicesPage />
                case "resources":
                case "privacy-policy":
                    return <PrivacyPolicy />;
                case "terms-and-conditions":
                    return <TermsAndConditions />;
                case "about-us":
                    return <AboutUs />;
                case "contact-us":
                    return <ContactUs />;
                case "faqs":
                    return <FAQ />;
                case "home":
                default:
                    // Falls through to tab rendering
                    break;
            }
        }

        // Priority 2: Render Sidebar tabs
        switch (currentTab) {
            case "overview": return <UserDashBoard />;
            case "bookings": return <MyBookings />;
            case "documents": return <Documents />;
            case "profile-settings": return <Profile />;
            case "support": return <Support />;
            case "settings": return <CustomerSettingsLayout />;
            case "payment": return <PaymentHistoryPage />;
            default: return <UserDashBoard />;
        }
    }

    return (
        <div className='w-full'>
            {renderPage()}
        </div>
    )
}

export default UserPage