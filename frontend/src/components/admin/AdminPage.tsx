'use client';

import { useSearchParams } from 'next/navigation';
import AdminDashboard from './Dashboard';
import { BiddingManagement } from './BiddingManagement';
import { RVSFPartners } from './RSVFPartners';
import { AnalyticsReports } from './AnalyticsReports';
import { DisputesSupport } from './DisputesSupport';
import VehiclesDashboard from './VehiclesDashboard';
import { PickupLogisticsDashboard } from './PickupLogisticsDashboard';
import { OperationsOverview } from './OperationsOverview';
import { DocumentsCompliance } from './DocumentsCompliance';
import { PaymentsAndSettlements } from './PaymentsAndSettlements';
import { NotificationsHub } from './NotificationsHub';
import { CustomersDashboard } from './CustomersDashboard';

const AdminPage = () => {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  const renderPage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <AdminDashboard />;

      case 'bidding-management':
        return <BiddingManagement />;

      case 'vehicles':
        return <VehiclesDashboard />;

      case 'customers':
        return <CustomersDashboard />;

      case 'partners':
        return <RVSFPartners />;

      case 'pickup-logistics':
        return <PickupLogisticsDashboard />;
        
      case 'operations':
        return <OperationsOverview />;

      case 'documents-compliance':
        return <DocumentsCompliance />;

      case 'payments-settlements':
        return <PaymentsAndSettlements />;

      case 'disputes-support':
        return <DisputesSupport />;

      case 'analytics-reports':
        return <AnalyticsReports />;

      case 'notifications':
        return <NotificationsHub />;;

      default:
        return <AdminDashboard />;
    }
  };

  return <div className="w-full">{renderPage()}</div>;
};

export default AdminPage;