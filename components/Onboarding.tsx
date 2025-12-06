
import React, { useState } from 'react';
import { Dealership } from '../types';
import { NAAMSA_BRANDS, SA_REGIONS } from '../constants';
import { Building2, MapPin, User, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck, Car, CreditCard } from 'lucide-react';

interface OnboardingProps {
  onComplete: (dealer: Dealership) => void;
  onCancel: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Dealership>>({
    name: '',
    contactPerson: '',
    email: '',
    brand: NAAMSA_BRANDS[0].id,
    region: SA_REGIONS[0],
    status: 'Active',
    leadsAssigned: 0
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const brandName = NAAMSA_BRANDS.find(b => b.id === formData.brand)?.name || formData.brand || 'Unknown';
    
    const newDealer: Dealership = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name!,
      contactPerson: formData.contactPerson!,
      email: formData.email!,
      brand: brandName,
      region: formData.region!,
      status: 'Active',
      leadsAssigned: 0,
      billing: {
        plan: 'Standard',
        costPerLead: 350,
        credits: 0,
        totalSpent: 0,
        lastBilledDate: new Date().toISOString().split('T')[0],
        currentUnbilledAmount: 0
      }
    };
    onComplete(newDealer);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {[1, 2, 3].map((num) => (
        <div key={num} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            step === num 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
              : step > num 
                ? 'bg-green-500 text-white' 
                : 'bg-slate-800 text-slate-500 border border-slate-700'
          }`}>
            {step > num ? <CheckCircle className="w-6 h-6" /> : num}
          </div>
          {num < 3 && (
            <div className={`w-16 h-1 mx-2 rounded-full ${step > num ? 'bg-green-500' : 'bg-slate-800'}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-2xl z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-900/20">
              <Car className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Welcome to AutoLead SA</h1>
          <p className="text-slate-400 text-lg">Let's set up your dealership profile to start receiving intelligent market leads.</p>
        </div>

        {renderStepIndicator()}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Step 1: Identity */}
          {step === 1 && (
            <div className="p-8 animate-in fade-in slide-in-from-right-8 duration-300">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Building2 className="w-6 h-6 mr-3 text-blue-400" />
                Dealership Profile
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Dealership Registered Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. McCarthy Toyota Centurion"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Manager / Principal Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        type="text"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                        placeholder="Full Name"
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-12 pr-5 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Lead Notification Email</label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="leads@dealership.co.za"
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Market Config */}
          {step === 2 && (
            <div className="p-8 animate-in fade-in slide-in-from-right-8 duration-300">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-3 text-blue-400" />
                Area of Responsibility (AOR)
              </h2>
              <p className="text-slate-400 mb-6 text-sm">
                We use this information to automatically route leads found in your geographic sector for your specific brand.
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Primary Brand Franchise</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1 custom-scrollbar">
                    {NAAMSA_BRANDS.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => setFormData({...formData, brand: brand.id})}
                        className={`flex items-center justify-center p-3 rounded-xl border transition-all ${
                          formData.brand === brand.id 
                            ? 'bg-blue-600/20 border-blue-500 text-white' 
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Geographic Region</label>
                  <select 
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {SA_REGIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="p-8 animate-in fade-in slide-in-from-right-8 duration-300 text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">You're All Set!</h2>
              <p className="text-slate-400 mb-8">Please review your details before entering the dashboard.</p>

              <div className="bg-slate-800/50 rounded-xl p-6 text-left space-y-4 border border-slate-700 mb-8">
                <div className="flex justify-between border-b border-slate-700 pb-3">
                  <span className="text-slate-500">Dealership</span>
                  <span className="text-white font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-3">
                  <span className="text-slate-500">Principal</span>
                  <span className="text-white font-medium">{formData.contactPerson}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-3">
                  <span className="text-slate-500">AOR Region</span>
                  <span className="text-white font-medium">{formData.region}</span>
                </div>
                <div className="flex justify-between items-center text-blue-300 bg-blue-900/20 p-2 rounded">
                  <span className="flex items-center text-sm"><CreditCard className="w-4 h-4 mr-2"/> Plan</span>
                  <span className="font-bold text-sm">Standard (Assigned)</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="bg-slate-900 border-t border-slate-800 p-6 flex justify-between items-center">
            {step > 1 ? (
              <button 
                onClick={handleBack}
                className="flex items-center text-slate-400 hover:text-white transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </button>
            ) : (
              <button 
                onClick={onCancel}
                className="text-slate-500 hover:text-slate-400 transition-colors font-medium"
              >
                Back to Login
              </button>
            )}

            <button 
              onClick={step === totalSteps ? handleSubmit : handleNext}
              disabled={step === 1 && (!formData.name || !formData.email)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === totalSteps ? 'Launch Dashboard' : 'Continue'}
              {step !== totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
