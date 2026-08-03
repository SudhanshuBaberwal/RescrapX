'use client';

import React, { useState, useRef } from 'react';
import { 
  FileText, UploadCloud, Trash2, ShieldCheck, HelpCircle,
  ArrowRight, ArrowLeft, FileSpreadsheet, Lock, ExternalLink, Loader2 
} from 'lucide-react';
import { documents } from '@/services/vehicle.service'; // Adjust path according to project directory

interface StepComponentProps {
  vehicleId: string;
  onContinue: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStepNumber: number;
  totalStepsCount: number;
}

export default function VehicleDocumentsPage({
  vehicleId,
  onContinue,
  onPrevious,
  currentStepNumber,
  totalStepsCount
}: StepComponentProps) {
  
  // Real JavaScript File State Management
  const [rcFile, setRcFile] = useState<File | null>(null);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [pucFile, setPucFile] = useState<File | null>(null);
  const [loanFile, setLoanFile] = useState<File | null>(null);
  const [otherFile, setOtherFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // DOM References for hidden file inputs
  const rcInputRef = useRef<HTMLInputElement>(null);
  const insuranceInputRef = useRef<HTMLInputElement>(null);
  const pucInputRef = useRef<HTMLInputElement>(null);
  const loanInputRef = useRef<HTMLInputElement>(null);
  const otherInputRef = useRef<HTMLInputElement>(null);

  // File validator and Size Formatter
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setFileState: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setApiError(`File "${file.name}" exceeds 5 MB size limit.`);
      return;
    }

    // Validate type (PNG, JPG, PDF)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setApiError(`Invalid format for "${file.name}". Only JPG, PNG, or PDF are allowed.`);
      return;
    }

    setApiError('');
    setFileState(file);
  };

  const formatFileSize = (bytes: number): string => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    // Pre-validation checks
    if (!rcFile) {
      setApiError("RC Book document is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        rcbook: rcFile,
        insurance: insuranceFile,
        puc: pucFile,
        loan_closure: loanFile,
        other: otherFile,
      };

      const response = await documents(vehicleId, payload);

      // STRICT CHECK: Next step logic after success confirmation
      if (response && (response.success || response.data)) {
        onContinue();
      } else {
        setApiError(response?.message || 'Failed to upload documents.');
      }

    } catch (error: any) {
      console.error("Documents submission error:", error);
      const errorMsg = error?.response?.data?.message || 'Error uploading documents. Ensure all required files are selected.';
      setApiError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      
      {/* MAIN DATA GRID FOR DOCUMENTS */}
      <main className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow-3xs space-y-6">
        
        {/* Header Block */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#0B5B32] text-white rounded-xl flex items-center justify-center text-xl shadow-xs shrink-0">
            <FileText size={22} className="stroke-[1.75]" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-lg font-black text-gray-900 tracking-tight">Documents & Keys</h1>
            <p className="text-[11px] font-bold text-gray-400">Step {currentStepNumber} of {totalStepsCount}</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Global Error Banner */}
        {apiError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold text-xs">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <p className="text-gray-400 font-bold mb-2">Please upload the following documents to help us verify your vehicle and generate the best offer.</p>

          {/* BLOCK 1: REQUIRED DOCUMENTS */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-gray-800 text-sm">Required Documents</h3>
            
            <div className="border border-gray-100 rounded-xl p-4 bg-white shadow-3xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              <div className="flex gap-3 items-start">
                <div className="p-3 bg-emerald-50 rounded-xl text-[#0B5B32] shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-gray-800 text-xs">RC Book (Registration Certificate)</span>
                    <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-md">Required</span>
                  </div>
                  <p className="text-gray-400 text-[11px] font-medium mt-0.5">Upload clear front side of RC book</p>
                </div>
              </div>

              {/* Upload Trigger Zone */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <input 
                  type="file" 
                  ref={rcInputRef} 
                  onChange={(e) => handleFileChange(e, setRcFile)}
                  className="hidden" 
                  accept="image/png, image/jpeg, image/jpg, application/pdf"
                />

                <div 
                  onClick={() => rcInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-[#0B5B32] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-gray-50/30 w-full sm:w-[180px] h-[90px]"
                >
                  <UploadCloud size={20} className="text-[#0B5B32] mb-1" />
                  <span className="font-bold text-[10px] text-gray-700">Upload File</span>
                  <span className="text-[9px] text-gray-400">or drag and drop</span>
                </div>

                {/* Preview Thumbnail for RC */}
                {rcFile && (
                  <div className="border border-gray-200 rounded-xl p-2.5 bg-white relative flex items-center gap-2.5 w-full sm:w-[210px] h-[90px]">
                    <div className="w-[80px] h-full bg-gray-100 rounded-lg shrink-0 flex items-center justify-center border border-gray-200 text-lg">
                      {rcFile.type.includes('pdf') ? '📄' : '🖼️'}
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5 pr-4">
                      <p className="font-extrabold text-[10px] text-gray-700 truncate">{rcFile.name}</p>
                      <p className="text-[9px] font-bold text-gray-400">{formatFileSize(rcFile.size)}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setRcFile(null)}
                      className="absolute bottom-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-gray-50 border border-gray-100 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* BLOCK 2: OPTIONAL / ADDITIONAL DOCUMENTS */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-gray-800 text-sm">Optional Documents (If Available)</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { id: 'insurance', title: 'Insurance Certificate', desc: 'Upload valid / expired', icon: ShieldCheck, ref: insuranceInputRef, state: insuranceFile, setState: setInsuranceFile },
                { id: 'puc', title: 'PUC Certificate', desc: 'Pollution Under Control', icon: FileSpreadsheet, ref: pucInputRef, state: pucFile, setState: setPucFile },
                { id: 'loan', title: 'Loan Closure Certificate', desc: 'If vehicle was under loan', icon: Lock, ref: loanInputRef, state: loanFile, setState: setLoanFile },
                { id: 'other', title: 'Other Documents', desc: 'Any other relevant document', icon: FileText, ref: otherInputRef, state: otherFile, setState: setOtherFile },
              ].map((doc) => {
                const DocIcon = doc.icon;
                return (
                  <div key={doc.id} className="border border-gray-100 rounded-xl p-3.5 bg-white shadow-3xs flex flex-col justify-between gap-4 min-h-[165px]">
                    <input 
                      type="file" 
                      ref={doc.ref} 
                      onChange={(e) => handleFileChange(e, doc.setState)}
                      className="hidden" 
                      accept="image/png, image/jpeg, image/jpg, application/pdf"
                    />

                    <div className="flex items-start gap-2.5">
                      <div className="p-2 bg-gray-50 text-gray-500 rounded-xl shrink-0">
                        <DocIcon size={15} />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-black text-gray-800 text-[11px] truncate leading-tight">{doc.title}</p>
                        <p className="text-[10px] text-gray-400 font-semibold truncate">{doc.desc}</p>
                      </div>
                    </div>

                    {doc.state ? (
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2 flex items-center justify-between gap-1">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[9px] text-emerald-800 truncate">{doc.state.name}</p>
                          <p className="text-[8px] text-emerald-600/80 font-semibold">{formatFileSize(doc.state.size)}</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => doc.setState(null)}
                          className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => doc.ref.current?.click()}
                        className="border border-dashed border-gray-200 hover:border-[#0B5B32] bg-gray-50/20 rounded-lg p-2.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                      >
                        <UploadCloud size={14} className="text-gray-400 mb-0.5" />
                        <span className="font-bold text-[9px] text-gray-700">Upload File</span>
                        <span className="text-[8px] text-gray-400">or drag and drop</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security Banner */}
          <div className="bg-emerald-50/30 border border-emerald-100/60 rounded-xl p-3 flex items-start gap-2.5 text-gray-600">
            <ShieldCheck size={14} className="text-[#0B5B32] shrink-0 mt-0.5" />
            <p className="font-bold text-[10px] leading-relaxed">
              Your documents are encrypted and securely stored. They are only used for verification and legal compliance.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
            <button 
              type="button"
              onClick={onPrevious}
              disabled={isSubmitting}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black text-xs px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-3xs disabled:opacity-50 cursor-pointer"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              <span>Back</span>
            </button>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black text-xs px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight size={14} strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>

        </form>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-3xs space-y-5">
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            Why upload <span className="text-[#0B5B32]">documents</span>?
          </h3>

          <div className="space-y-4 text-xs">
            {[
              { id: 1, title: 'Faster Verification', desc: 'Helps us verify your vehicle details quickly and provide accurate valuation.', icon: ShieldCheck },
              { id: 2, title: 'Better Offers', desc: 'Complete documents help us get you better and competitive offers.', icon: FileText },
              { id: 3, title: '100% Secure', desc: 'We use industry-standard encryption to protect your data.', icon: Lock },
              { id: 4, title: 'Trusted by Thousands', desc: 'Join 10,000+ customers who trust RescrapX for hassle-free scrapping.', icon: HelpCircle }
            ].map((perk) => {
              const Icon = perk.icon;
              return (
                <div key={perk.id} className="flex gap-3.5 items-start">
                  <div className="p-2 bg-emerald-50 text-[#0B5B32] border border-emerald-100 rounded-xl shrink-0">
                    <Icon size={15} />
                  </div>
                  <div className="space-y-0.5 mt-0.5">
                    <h4 className="font-black text-gray-800">{perk.title}</h4>
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{perk.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100 bg-[#F9FAFB] p-3.5 rounded-xl flex gap-3 text-gray-700 items-center justify-between">
            <div className="flex gap-2 items-center">
              <span className="text-base">💡</span>
              <div className="text-[11px]">
                <p className="font-black text-gray-800">Need Help?</p>
                <p className="text-gray-400 font-bold">Check required documents list</p>
              </div>
            </div>
            <ExternalLink size={13} className="text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>

        </div>
      </aside>

    </div>
  );
}