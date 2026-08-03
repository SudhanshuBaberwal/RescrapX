'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserNavbar from '@/components/navbar/UserNavbar';
import Footer from '@/components/footer/Footer';
import { createDraftVehicle } from '@/services/vehicle.service';
import { useDispatch, useSelector } from 'react-redux';
import { setVehicleData } from '@/store/vehicleSlice';
import {
  Car, Plus, Calendar, Gauge, Fuel, ShieldCheck,
  ArrowRight, Loader2, AlertCircle
} from 'lucide-react';
import { getAllVehicles } from '@/hooks/getAllVehicles';
import { RootState } from '@/store/store';
import { IVehicle } from '@/context/vehicleProvider';

export default function MyVehiclesPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Execute custom hook inside component body safely
  getAllVehicles();

  // Access allVehiclesData from Redux Store
  const { allVehiclesData } = useSelector((state: RootState) => state.vehicle);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state whenever Redux allVehiclesData updates
  useEffect(() => {
    if (allVehiclesData) {
      setLoading(false);
    }
  }, [allVehiclesData]);

  // Register new vehicle button handler
  const handleAddNewVehicle = async () => {
    try {
      setCreating(true);
      const data = await createDraftVehicle();
      dispatch(setVehicleData(data?.data));

      // Pass BOTH _id AND step 1
      const newId = data?.data?._id;
      router.push(`/register-vehicle/${newId}/1`);
    } catch (err) {
      console.error('Failed to create new draft:', err);
    } finally {
      setCreating(false);
    }
  };

  // Continue registration or view vehicle details
  const handleVehicleClick = (vehicle: IVehicle) => {
    if (vehicle.status === 'DRAFT' || (vehicle.currentStep && vehicle.currentStep < 8)) {
      dispatch(setVehicleData(vehicle));

      // Ensure both _id and currentStep are passed in URL
      router.push(`/register-vehicle/${vehicle._id}/${vehicle.currentStep || 1}`);
    } else {
      router.push(`/my-vehicles/${vehicle._id}`);
    }
  };

  // Helper for Status Badge styling
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="bg-emerald-50 text-[#0B5B32] border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-full">Completed</span>;
      case 'IN_PROGRESS':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black px-2.5 py-1 rounded-full">In Progress</span>;
      default:
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black px-2.5 py-1 rounded-full">Draft</span>;
    }
  };

  const vehiclesList = allVehiclesData || [];

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] text-[#374151] flex flex-col justify-between antialiased">
      <div>
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-6">
          <UserNavbar />

          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">My Registered Vehicles</h1>
              <p className="text-xs text-gray-500 font-medium">
                Manage your registered vehicles and track their scrapping progress.
              </p>
            </div>

            <button
              onClick={handleAddNewVehicle}
              disabled={creating}
              className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-[0.99] disabled:opacity-70 shrink-0"
            >
              {creating ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Plus size={16} strokeWidth={2.5} />
              )}
              <span>Register New Vehicle</span>
            </button>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 size={32} className="text-[#0B5B32] animate-spin" />
              <p className="text-xs font-bold text-gray-400">Loading your vehicles...</p>
            </div>
          )}

          {/* ERROR STATE */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 flex items-center gap-3 text-xs font-bold">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && vehiclesList.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-4 shadow-3xs max-w-xl mx-auto my-10">
              <div className="w-16 h-16 bg-emerald-50 text-[#0B5B32] rounded-full flex items-center justify-center mx-auto text-2xl">
                <Car size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-gray-900">No Vehicles Registered Yet</h3>
                <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto">
                  Start by registering your vehicle to get an instant valuation and best scrap price.
                </p>
              </div>
              <button
                onClick={handleAddNewVehicle}
                disabled={creating}
                className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-bold text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2 shadow-xs transition-all"
              >
                {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={15} />}
                <span>Register Vehicle Now</span>
              </button>
            </div>
          )}

          {/* VEHICLES GRID USING REDUX DATA directly */}
          {!loading && !error && vehiclesList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {vehiclesList.map((vehicle: IVehicle) => {
                const details = vehicle?.vehicleDetails;

                return (
                  <div
                    key={vehicle._id}
                    className="bg-white border border-gray-100 hover:border-emerald-200 rounded-2xl p-5 shadow-3xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
                    onClick={() => handleVehicleClick(vehicle)}
                  >
                    {/* Card Top: Title & Badge */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-50 text-[#0B5B32] rounded-xl flex items-center justify-center shrink-0">
                            <Car size={20} />
                          </div>
                          <div>
                            <h2 className="text-sm font-black text-gray-900 group-hover:text-[#0B5B32] transition-colors leading-tight">
                              {details?.carName || 'Unnamed Vehicle'}
                            </h2>
                            <p className="text-[11px] font-bold text-gray-400 mt-0.5">
                              {details?.model ? `${details.model} ${details.variant || ''}` : 'Model N/A'}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(vehicle.status)}
                      </div>

                      <hr className="border-gray-50" />

                      {/* Specs Grid */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 font-medium">
                        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-2">
                          <ShieldCheck size={13} className="text-[#0B5B32]" />
                          <span className="truncate">{details?.registrationNumber || 'No Reg No.'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-2">
                          <Calendar size={13} className="text-[#0B5B32]" />
                          <span>{details?.manufacturingYear || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-2">
                          <Fuel size={13} className="text-[#0B5B32]" />
                          <span className="capitalize">{details?.fuelType || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-2">
                          <Gauge size={13} className="text-[#0B5B32]" />
                          <span>{details?.kmsDriven ? `${details.kmsDriven} KM` : 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Bottom CTA */}
                    <div className="pt-2 flex justify-between items-center text-xs font-bold text-[#0B5B32] group-hover:translate-x-0.5 transition-transform">
                      <span>
                        {vehicle.status === 'VERIFIED' ? 'View Details' : `Continue Registration (Step ${vehicle.currentStep || 1})`}
                      </span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}