'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { getAllUserProfileData } from '@/hooks/getAllUserProfileData';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { openImage } from '@/services/admin.service';
import { approveKYC, rejectKYC } from '@/services/user.service';

const ModalImageCard: React.FC<{
  label: string;
  imageSource?: any;
  altText: string;
}> = ({ label, imageSource, altText }) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const rawPath = typeof imageSource === 'object' ? imageSource?.path : imageSource;

  useEffect(() => {
    let isMounted = true;

    const fetchPreviewUrl = async () => {
      if (!rawPath) return;

      if (typeof rawPath === 'string' && rawPath.startsWith('http')) {
        setPreviewUrl(rawPath);
        return;
      }

      try {
        setPreviewLoading(true);
        setHasError(false);

        const responseData = await openImage(rawPath);
        const url =
          responseData?.message ||
          responseData?.data?.message ||
          responseData?.data ||
          responseData?.url ||
          (typeof responseData === 'string' ? responseData : null);

        if (isMounted) {
          if (url && typeof url === 'string') {
            setPreviewUrl(url);
          } else {
            setHasError(true);
          }
        }
      } catch (err) {
        console.error('Failed to load preview image:', err);
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setPreviewLoading(false);
      }
    };

    fetchPreviewUrl();

    return () => {
      isMounted = false;
    };
  }, [rawPath]);

  const handleOpenImage = async () => {
    if (!rawPath) return;

    if (previewUrl) {
      window.open(previewUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const newTab = window.open('about:blank', '_blank');

    try {
      setLoading(true);
      const responseData = await openImage(rawPath);
      const fileUrl =
        responseData?.message ||
        responseData?.data?.message ||
        responseData?.data ||
        responseData?.url ||
        (typeof responseData === 'string' ? responseData : null);

      if (fileUrl && typeof fileUrl === 'string' && fileUrl.startsWith('http')) {
        if (newTab) {
          newTab.location.href = fileUrl;
        } else {
          window.open(fileUrl, '_blank', 'noopener,noreferrer');
        }
      } else {
        newTab?.close();
        alert('Could not retrieve a valid document URL.');
      }
    } catch (err) {
      newTab?.close();
      console.error('Error opening image:', err);
      alert('Failed to generate document link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5 flex-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {rawPath && (
          <button
            type="button"
            onClick={handleOpenImage}
            disabled={loading}
            className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold hover:underline disabled:opacity-50"
          >
            {loading ? 'Opening...' : 'View Document ↗'}
          </button>
        )}
      </div>

      <div
        onClick={handleOpenImage}
        className={`relative h-44 bg-slate-100/80 rounded-xl border border-slate-200/80 overflow-hidden flex items-center justify-center group shadow-xs ${rawPath ? 'cursor-pointer' : ''
          }`}
      >
        {previewLoading ? (
          <div className="flex flex-col items-center justify-center text-slate-400 space-y-1">
            <span className="text-[11px] font-medium">Loading preview...</span>
          </div>
        ) : previewUrl && !hasError ? (
          <img
            src={previewUrl}
            alt={altText}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-3 text-slate-400 space-y-1">
            <svg
              className="w-8 h-8 stroke-current opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span className="text-[11px] font-medium">
              {hasError ? 'Failed to preview image' : 'No document uploaded'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export interface UserOwner {
  _id?: string;
  fullName?: string;
  email?: string;
  verificationToken?: string | null;
  verificationTokenExpiresAt?: string | null;
}

export interface UserAddress {
  type?: string;
  addressDetails?: string;
  pincode?: string;
  landmark?: string;
  city?: string;
  state?: string;
}

export interface UserImage {
  path?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  uploadedAt?: string;
}

export interface UserVerificationDocument {
  _id?: string;
  type?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  submittedAt?: string;
  front?: UserImage;
  back?: UserImage;
}

export interface UserProfileItem {
  _id?: string;
  isVerifiedProfile: boolean;
  dateOfBirth?: string;
  phoneNumber?: string;
  gender?: string;
  address?: UserAddress;
  currentPic?: UserImage;
  owner?: UserOwner | string;
  vehicles?: Array<any>;
  verificationDocument?: UserVerificationDocument;
  createdAt?: string;
  updatedAt?: string;
}

export const CustomersDashboard: React.FC = () => {
  getAllUserProfileData();

  const { allUsersProfileData } = useSelector((state: RootState) => state.admin);

  const [localUsersList, setLocalUsersList] = useState<UserProfileItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [kycFilter, setKycFilter] = useState('ALL');

  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [isSubmittingKycAction, setIsSubmittingKycAction] = useState(false);

  useEffect(() => {
    if (Array.isArray(allUsersProfileData)) {
      setLocalUsersList(allUsersProfileData as unknown as UserProfileItem[]);
    }
  }, [allUsersProfileData]);

  const getOwnerDetails = (owner?: UserOwner | string): { fullName: string; email: string } => {
    if (owner && typeof owner === 'object') {
      return {
        fullName: owner.fullName || 'N/A',
        email: owner.email || 'No email provided',
      };
    }
    return { fullName: 'N/A', email: 'No email provided' };
  };

  const selectedCustomer = useMemo(() => {
    if (!localUsersList.length) return null;
    return localUsersList.find((u) => u._id === selectedUserId) || localUsersList[0];
  }, [localUsersList, selectedUserId]);

  const filteredUsers = useMemo(() => {
    return localUsersList.filter((user) => {
      const ownerInfo = getOwnerDetails(user.owner);
      const name = ownerInfo.fullName.toLowerCase();
      const email = ownerInfo.email.toLowerCase();
      const phone = user.phoneNumber || '';
      const id = (user._id || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        id.includes(query);

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && user.isVerifiedProfile) ||
        (statusFilter === 'INACTIVE' && !user.isVerifiedProfile);

      const kycStatus = String(user.verificationDocument?.status || 'PENDING');
      const matchesKyc = kycFilter === 'ALL' || kycStatus === kycFilter;

      return matchesSearch && matchesStatus && matchesKyc;
    });
  }, [localUsersList, searchQuery, statusFilter, kycFilter]);

  const dynamicKPIs = useMemo(() => {
    const total = localUsersList.length;
    const active = localUsersList.filter((u) => u.isVerifiedProfile).length;
    const kycVerified = localUsersList.filter(
      (u) => String(u.verificationDocument?.status || '') === 'APPROVED'
    ).length;
    const totalVehiclesCount = localUsersList.reduce((acc, u) => acc + (u.vehicles?.length || 0), 0);

    return [
      { title: 'Total Customers', value: total.toLocaleString(), trend: 'Real-time', color: 'text-emerald-600 bg-emerald-50' },
      { title: 'Active Customers', value: active.toLocaleString(), trend: 'Verified Profiles', color: 'text-emerald-600 bg-emerald-50' },
      { title: 'KYC Approved', value: kycVerified.toLocaleString(), trend: 'Passed Verification', color: 'text-emerald-600 bg-emerald-50' },
      { title: 'Total Registered Vehicles', value: totalVehiclesCount.toLocaleString(), trend: 'Across platform', color: 'text-emerald-600 bg-emerald-50' },
    ];
  }, [localUsersList]);

  const handleApproveKyc = async () => {
    if (!selectedCustomer?._id) return;
    try {
      setIsSubmittingKycAction(true);

      await approveKYC(selectedCustomer._id);

      setLocalUsersList((prevList) =>
        prevList.map((user) => {
          if (user._id === selectedCustomer._id) {
            return {
              ...user,
              isVerifiedProfile: true,
              verificationDocument: {
                ...user.verificationDocument,
                status: 'APPROVED',
              },
            };
          }
          return user;
        })
      );

      const ownerInfo = getOwnerDetails(selectedCustomer.owner);
      alert(`KYC for user ${ownerInfo.fullName || selectedCustomer._id} has been Approved.`);
      setIsKycModalOpen(false);
      setShowRejectionInput(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to approve KYC.');
    } finally {
      setIsSubmittingKycAction(false);
    }
  };

  const handleRejectKyc = async () => {
    if (!selectedCustomer?._id) return;
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    try {
      setIsSubmittingKycAction(true);

      await rejectKYC(selectedCustomer._id, rejectionReason.trim());

      setLocalUsersList((prevList) =>
        prevList.map((user) => {
          if (user._id === selectedCustomer._id) {
            return {
              ...user,
              verificationDocument: {
                ...user.verificationDocument,
                status: 'REJECTED',
              },
            };
          }
          return user;
        })
      );

      alert(`KYC rejected. Reason: ${rejectionReason}`);
      setIsKycModalOpen(false);
      setShowRejectionInput(false);
      setRejectionReason('');
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to reject KYC.');
    } finally {
      setIsSubmittingKycAction(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setKycFilter('ALL');
  };

  // Updated to consider both profile verification and document status
  const isApproved =
    Boolean(selectedCustomer?.isVerifiedProfile) ||
    selectedCustomer?.verificationDocument?.status === 'APPROVED';

  return (
    <div className="w-full flex flex-col justify-between min-h-screen bg-slate-50/50 text-slate-700">
      <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customers</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage and view all live registered customer profiles on RescrapX.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {dynamicKPIs.map((kpi, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase truncate">{kpi.title}</span>
              <div className="mt-2">
                <div className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
                <div className={`text-[10px] inline-block mt-1 px-1.5 py-0.5 rounded font-bold ${kpi.color}`}>
                  {kpi.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="relative lg:col-span-2">
              <span className="absolute left-3 top-2 text-slate-400 text-xs">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, phone, email, or User ID..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-slate-300"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none text-slate-600 font-medium"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>

            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none text-slate-600 font-medium"
            >
              <option value="ALL">KYC Status (All)</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <button
              onClick={handleResetFilters}
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-lg py-2 transition-colors lg:col-span-2"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs xl:col-span-8 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                All Registered Users <span className="text-slate-400 font-normal">({filteredUsers.length})</span>
              </h3>
            </div>

            <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
              <table className="w-full text-left text-xs text-slate-600 min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3">User ID</th>
                    <th className="p-3">Customer Details</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Location</th>
                    <th className="p-3 text-center">Vehicles</th>
                    <th className="p-3">Profile Status</th>
                    <th className="p-3">KYC Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-6 text-slate-400 text-xs font-semibold">
                        No user profile records found matching search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isSelected = selectedCustomer?._id === user._id;
                      const ownerInfo = getOwnerDetails(user.owner);
                      const kycDocStatus = String(user.verificationDocument?.status || 'NOT SUBMITTED');

                      return (
                        <tr
                          key={user._id}
                          onClick={() => setSelectedUserId(user._id!)}
                          className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${isSelected ? 'bg-emerald-50/40' : ''}`}
                        >
                          <td className="p-3 font-mono font-bold text-slate-500 max-w-[100px] truncate" title={user._id}>
                            {user._id ? user._id.slice(-8).toUpperCase() : 'N/A'}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-800">{ownerInfo.fullName}</div>
                            <div className="text-[10px] text-slate-400">{ownerInfo.email}</div>
                          </td>
                          <td className="p-3 font-medium text-slate-600">{user.phoneNumber || 'N/A'}</td>
                          <td className="p-3 text-slate-700">
                            {user.address?.city || user.address?.pincode ? `${user.address?.city || ''} ${user.address?.pincode || ''}` : 'N/A'}
                          </td>
                          <td className="p-3 text-center font-bold text-slate-800">{user.vehicles?.length || 0}</td>
                          <td className="p-3">
                            {user.isVerifiedProfile || kycDocStatus === 'APPROVED' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                                ✓ Approved
                              </span>
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${kycDocStatus === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                kycDocStatus === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                                }`}>
                                {kycDocStatus === 'PENDING' && '◷ Pending Review'}
                                {kycDocStatus === 'REJECTED' && '✕ Rejected'}
                                {kycDocStatus === 'NOT SUBMITTED' && 'Not Uploaded'}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${kycDocStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600' :
                              kycDocStatus === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                kycDocStatus === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                              }`}>
                              {kycDocStatus === 'VERIFIED' && '✓ Approved'}
                              {kycDocStatus === 'PENDING' && '◷ Pending Review'}
                              {kycDocStatus === 'REJECTED' && '✕ Rejected'}
                              {kycDocStatus === 'NOT SUBMITTED' && 'Not Uploaded'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs xl:col-span-4 space-y-5">
            {selectedCustomer ? (
              <>
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{getOwnerDetails(selectedCustomer.owner).fullName}</h3>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${selectedCustomer.isVerifiedProfile ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {selectedCustomer.isVerifiedProfile ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                      ID: {selectedCustomer._id}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="text-slate-400 text-[9px] block uppercase font-bold">Total Vehicles</span>
                    <span className="font-black text-slate-900 text-base">{selectedCustomer.vehicles?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[9px] block uppercase font-bold">Gender</span>
                    <span className="font-black text-slate-800 text-sm uppercase">{selectedCustomer.gender || 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-b border-slate-100 pb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone Number</span>
                    <span className="font-bold text-slate-900">{selectedCustomer.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date of Birth</span>
                    <span className="font-bold text-slate-900">
                      {selectedCustomer.dateOfBirth ? new Date(selectedCustomer.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Address</span>
                    <span className="font-bold text-slate-900 text-right max-w-[180px] truncate">
                      {selectedCustomer.address?.addressDetails || 'No address details'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pincode</span>
                    <span className="font-bold text-slate-900">{selectedCustomer.address?.pincode || 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">KYC Verification</h4>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Type: {selectedCustomer.verificationDocument?.type || 'N/A'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">Status</span>
                      <span className={`font-bold text-[10px] px-2 py-0.5 rounded ${selectedCustomer.verificationDocument?.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                        selectedCustomer.verificationDocument?.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          selectedCustomer.verificationDocument?.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'
                        }`}>
                        {selectedCustomer.verificationDocument?.status || 'NOT SUBMITTED'}
                      </span>
                    </div>

                    {selectedCustomer.verificationDocument?.submittedAt && (
                      <div className="text-[10px] text-slate-400">
                        Submitted on: {new Date(selectedCustomer.verificationDocument.submittedAt).toLocaleString()}
                      </div>
                    )}

                    <button
                      disabled={!selectedCustomer.verificationDocument}
                      onClick={() => setIsKycModalOpen(true)}
                      className="w-full mt-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
                    >
                      {selectedCustomer.verificationDocument ? 'Inspect & Process KYC' : 'No KYC Submitted'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">Select a customer from the table to view details.</p>
            )}
          </div>
        </div>
      </main>

      {/* KYC VERIFICATION MODAL */}
      {isKycModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 transition-all">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">KYC Document Verification</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Reviewing documents for{' '}
                  <span className="font-semibold text-slate-800">
                    {getOwnerDetails(selectedCustomer.owner).fullName}
                  </span>{' '}
                  ({selectedCustomer.verificationDocument?.type || 'DOCUMENT'})
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsKycModalOpen(false);
                  setShowRejectionInput(false);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ModalImageCard
                label="Live User Selfie"
                imageSource={selectedCustomer.currentPic}
                altText="Live User Selfie"
              />
              <ModalImageCard
                label="Document Front"
                imageSource={selectedCustomer.verificationDocument?.front}
                altText="Document Front"
              />
              <ModalImageCard
                label="Document Back"
                imageSource={selectedCustomer.verificationDocument?.back}
                altText="Document Back"
              />
            </div>

            {showRejectionInput && (
              <div className="space-y-2 bg-rose-50/70 border border-rose-200 p-4 rounded-xl">
                <label className="text-xs font-bold text-rose-900 block">
                  Reason for Rejection <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why the KYC is being rejected..."
                  className="w-full border border-rose-200 rounded-lg p-2.5 text-xs outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 bg-white"
                />
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              {isApproved ? (
                <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs py-2.5 rounded-xl text-center">
                  ✓ Document Approved
                </div>
              ) : !showRejectionInput ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowRejectionInput(true)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Reject KYC
                  </button>
                  <button
                    type="button"
                    disabled={isSubmittingKycAction}
                    onClick={handleApproveKyc}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
                  >
                    {isSubmittingKycAction ? 'Approving...' : 'Approve KYC'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowRejectionInput(false)}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSubmittingKycAction || !rejectionReason.trim()}
                    onClick={handleRejectKyc}
                    className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
                  >
                    {isSubmittingKycAction ? 'Submitting...' : 'Confirm Rejection'}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-3.5 flex justify-between items-center w-full shrink-0">
        <p className="text-[11px] text-slate-400">© 2026 RescrapX Admin Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};