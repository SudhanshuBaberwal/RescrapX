'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud, FileText, CheckCircle2,
  ArrowLeft, ArrowRight, Loader2, Trash2
} from 'lucide-react';
import { useToast } from '@/lib/ui/toast/ToastContext';
import api from '@/utils/api';

// Define expected document structures
interface UploadedFileState {
  file: File | null;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
}

export default function PartnerDocumentsPage() {
  const { showToast } = useToast()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Document states matching form input keys
  const [documents, setDocuments] = useState<Record<string, UploadedFileState>>({
    rvsf_auth: { file: null, status: 'idle', progress: 0 },
    gst_cert: { file: null, status: 'idle', progress: 0 },
    pan_card: { file: null, status: 'idle', progress: 0 },
    company_reg: { file: null, status: 'idle', progress: 0 },
    bank_details: { file: null, status: 'idle', progress: 0 },
  });

  const requiredDocuments = [
    { key: 'rvsf_auth', label: 'RVSF Authorization Certificate', extra: 'Government approved certificate' },
    { key: 'gst_cert', label: 'GST Certificate', extra: 'Form GST REG-06' },
    { key: 'pan_card', label: 'PAN Card', extra: 'Company/Firm Permanent Account Number' },
    { key: 'company_reg', label: 'Company Registration Certificate', extra: 'COI / Partnership Deed / LLP Agreement' },
    { key: 'bank_details', label: 'Bank Account Details', extra: 'Cancelled Cheque / Bank Statement' },
  ];

  // Progressive uploader simulation
  const simulateUpload = (key: string, file: File) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: { file, status: 'uploading', progress: 10 },
    }));

    let progress = 10;
    const interval = setInterval(() => {
      progress += 30;
      if (progress >= 100) {
        clearInterval(interval);
        setDocuments((prev) => ({
          ...prev,
          [key]: { ...prev[key], status: 'success', progress: 100 },
        }));
        showToast(`${file.name} uploaded successfully!`, 'success');
      } else {
        setDocuments((prev) => ({
          ...prev,
          [key]: { ...prev[key], progress },
        }));
      }
    }, 150);
  };

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    // Format & Size validation
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Only PDF, JPG, and PNG formats are accepted.', 'error');
      return;
    }

    if (file.size > maxSizeBytes) {
      showToast('File size exceeds the 5MB limit.', 'warning');
      return;
    }

    simulateUpload(key, file);
  };

  const handleDeleteFile = (key: string) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: { file: null, status: 'idle', progress: 0 },
    }));
    showToast('Document removed.', 'info');
  };

  // Unified Form Data Submission Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verify if all required elements are active
    const missingDocs = requiredDocuments.filter(
      (doc) => documents[doc.key].status !== 'success' || !documents[doc.key].file
    );

    if (missingDocs.length > 0) {
      showToast(
        `Please upload all required files. (${missingDocs.length} remaining)`,
        'warning'
      );
      return;
    }

    try {
      setIsLoading(true);

      // Instantiating standard dynamic multipart wrapper
      const formData = new FormData();

      // Appending all the backend required file objects
      formData.append("rvsfCertificate", documents.rvsf_auth.file as File);
      formData.append("gstCertificate", documents.gst_cert.file as File);
      formData.append("panCard", documents.pan_card.file as File);
      formData.append("registrationCertificate", documents.company_reg.file as File);
      formData.append("bankDetails", documents.bank_details.file as File);

      // API Pipeline call
      await api.post(
        "/api/auth/partner/upload-documents",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showToast('RVSF Verification Documents Submitted Successfully!', 'success');
      router.push('/');
    } catch (err: any) {
      console.error(err);
      showToast(
        err?.response?.data?.message ||
        'Document submission pipeline failed. Please check files and try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-4 md:p-8 font-sans text-gray-800">

      {/* Header Container */}
      <div className="w-full max-w-5xl mx-auto my-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10 md:p-12 space-y-8">

        {/* Navigation & Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Partner Portal</span>
          </button>
          <div className="text-left sm:text-right">
            <span className="text-[#0B5B32] font-black text-xs uppercase tracking-widest">Step 3 of 3</span>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">Verification Documents</h1>
          </div>
        </div>

        {/* Informative Security Banner */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex gap-4 items-start">
          <div className="bg-emerald-100 text-[#0B5B32] p-2 rounded-xl shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-gray-900">High-Security Document Encryption</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              We align strictly with standard government audit processes. All uploaded documents are insulated, encrypted, and stored directly in a protected access vault solely for RVSF verification clearance.
            </p>
          </div>
        </div>

        {/* Main Files Form Grid */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requiredDocuments.map((doc) => {
              const currentDoc = documents[doc.key];
              return (
                <div
                  key={doc.key}
                  className={`border rounded-2xl p-5 transition-all flex flex-col justify-between min-h-[170px] ${currentDoc.status === 'success'
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : currentDoc.status === 'error'
                      ? 'border-red-200 bg-red-50/10'
                      : 'border-gray-200 bg-gray-50/30'
                    }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-900 font-extrabold block">{doc.label}</span>
                      <span className="text-red-500 text-xs font-bold">* Required</span>
                    </div>
                    <span className="text-xs text-gray-400 block font-semibold leading-normal">{doc.extra}</span>
                  </div>

                  {/* Dynamic Status States */}
                  {currentDoc.status === 'idle' && (
                    <div className="mt-4">
                      <label className="bg-white border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50/10 text-gray-700 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-all w-full">
                        <UploadCloud size={16} className="text-gray-400" />
                        <span>Choose and Upload Document</span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf, .jpg, .jpeg, .png"
                          onChange={(e) => handleFileChange(doc.key, e)}
                        />
                      </label>
                    </div>
                  )}

                  {currentDoc.status === 'uploading' && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
                        <span className="flex items-center gap-1.5">
                          <Loader2 size={14} className="animate-spin text-emerald-600" />
                          Uploading {currentDoc.file?.name}
                        </span>
                        <span>{currentDoc.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full transition-all duration-150"
                          style={{ width: `${currentDoc.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {currentDoc.status === 'success' && (
                    <div className="mt-4 flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText size={20} className="text-[#0B5B32] shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs font-extrabold text-[#0B5B32] block truncate">{currentDoc.file?.name}</span>
                          <span className="text-[10px] text-emerald-600 font-bold block">Securely Stored</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteFile(doc.key)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-400 font-bold">
              PDF, JPG, PNG formats accepted up to 5MB per file.
            </span>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 bg-[#0B5B32] hover:bg-[#073d21] text-white font-black py-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Uploads...</span>
                </>
              ) : (
                <>
                  <span>Submit Securely</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Corporate Copyright text */}
      <p className="text-center text-xs text-gray-400 font-medium mt-8">
        © 2026 RescrapX Inc. All legal architecture secured.
      </p>
    </div>
  );
}