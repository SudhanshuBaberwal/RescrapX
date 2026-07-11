'use client';

import { useSearchParams } from 'next/navigation';

import VendorDashboard from './Dashboard';
import LiveAuctions from './LiveAuctionsDashboard';
import MyBids from './MyBidsDashboard';
import WonVehicles from './WonVehiclesDashboard';
import IncomingVehicles from './IncomingVehiclesDashboard';
import ProcessingYard from './ProcessingYardDashboard';
import Documents from './DocumentsDashboard';
import PaymentsAndSettlements from './PaymentsSettlementsDashboard';
import Analytics from './AnalyticsDashboard';
import Notifications from './NotificationsDashboard';
import Support from './SupportHelpDashboard';
import ProfileSettings from './ProfileSettingsDashboard';

const VendorLayoutPage = () => {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  const renderPage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <VendorDashboard />;

      case 'live-auctions':
        return <LiveAuctions />;

      case 'my-bids':
        return <MyBids />;

      case 'won-vehicles':
        return <WonVehicles />;

      case 'incoming-vehicles':
        return <IncomingVehicles />;

      case 'processing-yard':
        return <ProcessingYard />;

      case 'documents':
        return <Documents />;

      case 'payments-settlements':
        return <PaymentsAndSettlements />;

      case 'analytics':
        return <Analytics />;

      case 'notifications':
        return <Notifications />;

      case 'support':
        return <Support />;

      case 'profile-settings':
        return <ProfileSettings />;

      default:
        return <VendorDashboard />;
    }
  };

  return <div className="w-full">{renderPage()}</div>;
};

export default VendorLayoutPage;