'use client';

import React, { useState, useRef } from 'react';
import {
  User, Lock, Sliders, Shield, CheckCircle2,
  Mail, Phone, Bell, FileText, Trash2, AlertTriangle, MessageSquare,
  Camera, UploadCloud, BadgeCheck, RefreshCw, Save
} from 'lucide-react';
import { KYC, updateProfile } from '@/services/user.service';

export interface ProfileData {
  dateOfBirth: string;
  phoneNumber: string;
  gender: string;
  addressType: string;
  addressDetails: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
}

const ADDRESS_TYPE_OPTIONS = ['PRIMARY', 'SECONDARY'] as const;
const GENDER_OPTIONS = ['MALE', 'FEMALE', 'OTHER'] as const;

export default function CustomerSettingsLayout() {
  const [activeTab, setActiveTab] = useState('profile');

  // Profile State mapped strictly to backend field types
  const [profileData, setProfileData] = useState<ProfileData>({
    dateOfBirth: '',
    phoneNumber: '',
    gender: 'MALE',
    addressType: 'PRIMARY',
    addressDetails: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Simple State Handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Profile Data to API
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      await updateProfile(profileData);
      alert('Profile details updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile details.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Camera & KYC Verification States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedDocType, setSelectedDocType] = useState('aadhaar');
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [kycStatus, setKycStatus] = useState<'pending' | 'submitted' | 'verified'>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preferences Toggle States
  const [preferences, setPreferences] = useState({
    sms: true,
    email: true,
    whatsapp: true,
    promotional: false,
    policy: true,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Camera Controls
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert('Unable to access camera. Please allow camera permissions.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setUserPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const getFormattedDocType = (type: string) => {
    switch (type) {
      case 'aadhaar':
        return 'AADAHAR_CARD';
      case 'pan':
        return 'PAN_CARD';
      case 'dl':
        return 'DRIVING_LICENSE';
      case 'passport':
        return 'PASSPORT';
      default:
        return type.toUpperCase();
    }
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userPhoto) {
        alert('Please capture a live photo.');
        return;
      }
      if (!idFrontFile) {
        alert('Please upload the front side of your Government ID.');
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData();
      const currentPicFile = dataURLtoFile(userPhoto, 'live_photo.jpg');

      formData.append('front', idFrontFile);
      if (idBackFile) {
        formData.append('back', idBackFile);
      }
      formData.append('currentPic', currentPicFile);
      formData.append('documentType', getFormattedDocType(selectedDocType));

      await KYC(formData);

      setKycStatus('submitted');
    } catch (error) {
      console.error(error);
      alert('Failed to submit KYC documentation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Personal Profile', icon: User },
    { id: 'kyc', name: 'Verify Documentations', icon: BadgeCheck },
    { id: 'password', name: 'Change Password', icon: Lock },
    { id: 'preferences', name: 'Notification Preferences', icon: Sliders },
    { id: 'security', name: 'Security & Account', icon: Shield },
  ];

  return (
    <div className="w-full space-y-6 text-[#374151]">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Settings</h1>
        <p className="text-xs font-semibold text-gray-400 mt-0.5">
          Manage your personal details, account security, and verification documents.
        </p>
      </div>

      {/* TAB NAVIGATION */}
      <div className="border-b border-gray-100 flex gap-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 text-xs font-bold pb-3 px-1 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-[#0B5B32] text-[#0B5B32] font-black'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={14} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: PERSONAL PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-5">
            <div className="flex flex-wrap gap-2 justify-between items-center pb-1">
              <div>
                <h3 className="text-sm font-black text-gray-900">Personal Information</h3>
                <p className="text-[11px] text-gray-400 font-medium">
                  Update your personal identity details and contact methods.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('kyc')}
                  className="flex items-center gap-1.5 bg-[#0B5B32] hover:bg-[#094d2a] text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-2xs"
                >
                  <BadgeCheck size={14} />
                  <span>Verify Documents</span>
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-2xs"
                >
                  <Save size={12} />
                  <span>{isSavingProfile ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 font-bold rounded-lg p-2.5 focus:outline-none focus:border-[#0B5B32]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+919876543210"
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 font-bold rounded-lg p-2.5 focus:outline-none focus:border-[#0B5B32]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Gender
                </label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 font-bold rounded-lg p-2.5 focus:outline-none focus:border-[#0B5B32]"
                >
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-5">
            <div className="flex justify-between items-center pb-1">
              <div>
                <h3 className="text-sm font-black text-gray-900">Address Information</h3>
                <p className="text-[11px] text-gray-400 font-medium">
                  Manage your address layout used for logistics and vehicle inspections.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Address Type
                  </label>
                  <select
                    name="addressType"
                    value={profileData.addressType}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 font-bold rounded-lg p-2.5 focus:outline-none focus:border-[#0B5B32]"
                  >
                    {ADDRESS_TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Address Details
                  </label>
                  <textarea
                    name="addressDetails"
                    rows={3}
                    value={profileData.addressDetails}
                    onChange={handleInputChange}
                    placeholder="Street name, house number, area details..."
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 font-bold rounded-lg p-2.5 focus:outline-none focus:border-[#0B5B32] resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 font-bold rounded-lg p-2.5 focus:outline-none focus:border-[#0B5B32]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={profileData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 font-bold rounded-lg p-2.5 focus:outline-none focus:border-[#0B5B32]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={profileData.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter pincode"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 font-bold rounded-lg p-2.5 focus:outline-none focus:border-[#0B5B32]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={profileData.landmark}
                    onChange={handleInputChange}
                    placeholder="Nearby landmark"
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 font-bold rounded-lg p-2.5 focus:outline-none focus:border-[#0B5B32]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-xs flex items-center gap-2"
              >
                <Save size={14} />
                <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Details'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB CONTENT: VERIFY DOCUMENTATIONS (KYC) */}
      {activeTab === 'kyc' && (
        <form onSubmit={handleKycSubmit} className="space-y-6">
          {kycStatus === 'submitted' && (
            <div className="bg-[#E6F4EA] border border-[#0B5B32]/20 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0B5B32] text-white rounded-xl">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900">Verification Submitted</h4>
                  <p className="text-[11px] text-gray-600 font-medium">
                    Your live photo and government document are under review. It usually takes 10–15 minutes.
                  </p>
                </div>
              </div>
              <span className="bg-[#0B5B32] text-white text-[10px] font-black px-3 py-1 rounded-lg">
                Under Review
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step 1: Live Photo */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-900">1. Live Photo Verification</h3>
                  <span className="text-[10px] font-bold text-[#0B5B32] bg-[#E6F4EA] px-2 py-0.5 rounded-md">
                    Step 1 of 2
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  Take a real-time photo of yourself to confirm your identity matches your document.
                </p>
              </div>

              <div className="relative w-full h-56 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden flex flex-col items-center justify-center text-center p-4">
                {userPhoto ? (
                  <div className="relative w-full h-full">
                    <img src={userPhoto} alt="Captured user" className="w-full h-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setUserPhoto(null);
                        startCamera();
                      }}
                      className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-1.5"
                    >
                      <RefreshCw size={12} /> Retake
                    </button>
                  </div>
                ) : isCameraActive ? (
                  <div className="relative w-full h-full">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-lg scale-x-[-1]" />
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#0B5B32] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-2 hover:bg-[#094d2a]"
                    >
                      <Camera size={14} /> Capture Photo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-emerald-50 text-[#0B5B32] rounded-full flex items-center justify-center mx-auto">
                      <Camera size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">Camera Access Required</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Ensure good lighting and face clearly visible</p>
                    </div>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs inline-flex items-center gap-2"
                    >
                      <Camera size={14} /> Open Camera
                    </button>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>

            {/* Step 2: Government ID */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-900">2. Government ID Proof</h3>
                  <span className="text-[10px] font-bold text-[#0B5B32] bg-[#E6F4EA] px-2 py-0.5 rounded-md">
                    Step 2 of 2
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  Upload a clear photo or copy of your government identity document.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Document Type</label>
                <select
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl p-2.5 focus:outline-none focus:border-[#0B5B32]"
                >
                  <option value="aadhaar">Government Identity Card (e.g., Identity / Voter ID)</option>
                  <option value="pan">Permanent Account Number (PAN Card)</option>
                  <option value="dl">Driving License</option>
                  <option value="passport">Passport</option>
                </select>
              </div>

              {/* ID PREVIEWS AND INPUTS */}
              <div className="grid grid-cols-2 gap-3">
                {/* Front Side Upload / Preview */}
                {idFrontFile ? (
                  <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center min-h-[100px] overflow-hidden group">
                    {idFrontFile.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(idFrontFile)}
                        alt="Front ID Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-[11px] font-bold text-gray-700 p-2 text-center break-all">
                        {idFrontFile.name}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setIdFrontFile(null)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-md text-[10px] shadow-sm transition"
                      title="Remove file"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-200 hover:border-[#0B5B32] bg-gray-50/50 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[100px]">
                    <UploadCloud size={20} className="text-gray-400 mb-1" />
                    <span className="text-[11px] font-bold text-gray-700">Upload Front Side</span>
                    <span className="text-[9px] text-gray-400 mt-0.5">JPG, PNG or PDF</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => setIdFrontFile(e.target.files?.[0] || null)}
                    />
                  </label>
                )}

                {/* Back Side Upload / Preview */}
                {idBackFile ? (
                  <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center min-h-[100px] overflow-hidden group">
                    {idBackFile.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(idBackFile)}
                        alt="Back ID Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-[11px] font-bold text-gray-700 p-2 text-center break-all">
                        {idBackFile.name}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setIdBackFile(null)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-md text-[10px] shadow-sm transition"
                      title="Remove file"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-200 hover:border-[#0B5B32] bg-gray-50/50 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[100px]">
                    <UploadCloud size={20} className="text-gray-400 mb-1" />
                    <span className="text-[11px] font-bold text-gray-700">Upload Back Side</span>
                    <span className="text-[9px] text-gray-400 mt-0.5">Optional for PAN</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => setIdBackFile(e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0B5B32] hover:bg-[#094d2a] disabled:bg-gray-400 text-white font-bold text-xs py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-2"
                >
                  <BadgeCheck size={16} /> {isSubmitting ? 'Submitting...' : 'Submit Documents for Verification'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB CONTENT: CHANGE PASSWORD */}
      {activeTab === 'password' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-sm font-black text-gray-900">Security Credentials</h3>
            <p className="text-[11px] text-gray-400 font-medium">
              Ensure your account is using a secure long password structure.
            </p>
          </div>

          <div className="max-w-md space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-white border border-gray-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32]" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">New Password</label>
              <input type="password" placeholder="Min. 8 characters" className="w-full bg-white border border-gray-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32]" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Confirm New Password</label>
              <input type="password" placeholder="Re-type new password" className="w-full bg-white border border-gray-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32]" />
            </div>
            <button className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-xs">
              Update Password
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: NOTIFICATION PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-sm font-black text-gray-900">Communication Channels</h3>
            <p className="text-[11px] text-gray-400 font-medium">Control the alert flows you want to get during the scrap journey updates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 text-gray-500 rounded-lg"><Phone size={14} /></div>
                  <div>
                    <p className="text-xs font-black text-gray-800">SMS Notifications</p>
                    <p className="text-[10px] text-gray-400 font-medium">Receive updates via SMS</p>
                  </div>
                </div>
                <button onClick={() => handleToggle('sms')} className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${preferences.sms ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${preferences.sms ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 text-gray-500 rounded-lg"><Mail size={14} /></div>
                  <div>
                    <p className="text-xs font-black text-gray-800">Email Notifications</p>
                    <p className="text-[10px] text-gray-400 font-medium">Receive updates via Email</p>
                  </div>
                </div>
                <button onClick={() => handleToggle('email')} className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${preferences.email ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${preferences.email ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 text-gray-500 rounded-lg"><MessageSquare size={14} /></div>
                  <div>
                    <p className="text-xs font-black text-gray-800">WhatsApp Notifications</p>
                    <p className="text-[10px] text-gray-400 font-medium">Receive updates via WhatsApp</p>
                  </div>
                </div>
                <button onClick={() => handleToggle('whatsapp')} className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${preferences.whatsapp ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${preferences.whatsapp ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 text-gray-500 rounded-lg"><Bell size={14} /></div>
                  <div>
                    <p className="text-xs font-black text-gray-800">Promotional Updates</p>
                    <p className="text-[10px] text-gray-400 font-medium">Receive offers and tips</p>
                  </div>
                </div>
                <button onClick={() => handleToggle('promotional')} className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${preferences.promotional ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${preferences.promotional ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 text-gray-500 rounded-lg"><FileText size={14} /></div>
                  <div>
                    <p className="text-xs font-black text-gray-800">Policy & Legal Updates</p>
                    <p className="text-[10px] text-gray-400 font-medium">Important policy updates</p>
                  </div>
                </div>
                <button onClick={() => handleToggle('policy')} className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${preferences.policy ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${preferences.policy ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SECURITY & ACCOUNT */}
      {activeTab === 'security' && (
        <div className="bg-red-50/20 border border-red-100 rounded-2xl p-5 md:p-6 space-y-4">
          <div>
            <h3 className="text-sm font-black text-red-600">Danger Zone</h3>
            <p className="text-[11px] text-gray-400 font-medium">
              Sensitive modifications connected permanently to data extraction routines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                  <AlertTriangle size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-gray-800">Deactivate Account</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Temporarily disable account access</p>
                </div>
              </div>
              <button className="text-xs font-bold text-amber-600 hover:underline shrink-0">Deactivate</button>
            </div>

            <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0">
                  <Trash2 size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-gray-800">Delete Account</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Permanently remove profile data</p>
                </div>
              </div>
              <button className="text-xs font-bold text-red-600 hover:underline shrink-0">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}