
import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, CheckCircle, Star, TrendingUp, Building2 } from 'lucide-react';
import { User, Dealership } from '../types';
import { signInDealer } from '../services/supabaseService';
import { Logo } from './Logo';

interface LoginProps {
  dealers: Dealership[];
  onLogin: (user: User) => void;
  onSignUpClick: () => void;
}

const Login: React.FC<LoginProps> = ({ dealers, onLogin, onSignUpClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Authenticate against Database (Or Mock Data if offline)
      const dealer = await signInDealer(email);

      if (dealer) {
        if (dealer.status !== 'Active') {
          setError("Account is pending approval. Please contact support.");
          setIsLoading(false);
          return;
        }

        const role = email.toLowerCase().includes('admin') ? 'ADMIN' : 'DEALER';

        onLogin({
          id: `user-${dealer.id}`,
          name: dealer.contactPerson,
          email: dealer.email,
          role: role,
          dealerId: dealer.id,
          avatar: `https://i.pravatar.cc/150?u=${dealer.id}`
        });
      } else {
        setError("Email not found. Please register your dealership first.");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center relative z-10 p-6 lg:p-12 gap-12">
        
        {/* Left Side: Value Prop */}
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left animate-in slide-in-from-left-10 duration-700">
           <div className="flex justify-center lg:justify-start">
              <Logo className="w-16 h-16" showText={true} textSize="xl" />
           </div>
           
           <div className="inline-flex items-center space-x-3 bg-slate-900/50 border border-slate-700 rounded-full px-4 py-1.5 mb-2 backdrop-blur-md">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm text-slate-300">New: AI Video Marketing Kit</span>
           </div>
           
           <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Stop Waiting.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Start Converting.</span>
           </h1>
           
           <p className="text-xl text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              AutoLead SA uses Google Gemini AI to find in-market vehicle buyers from social media and forums, delivering them directly to your dealership's CRM.
           </p>

           <div className="space-y-4 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center space-x-3 text-slate-300">
                 <CheckCircle className="w-5 h-5 text-green-400" />
                 <span>Exclusive <b>NAAMSA</b> Brand Intelligence</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                 <CheckCircle className="w-5 h-5 text-green-400" />
                 <span><b>POPIA</b> Compliant Outreach Scripts</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300">
                 <CheckCircle className="w-5 h-5 text-green-400" />
                 <span>Automated <b>AOR</b> Lead Distribution</span>
              </div>
           </div>

           <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={onSignUpClick}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-900/30 transition-all transform hover:-translate-y-1 flex items-center justify-center"
              >
                 <Building2 className="w-5 h-5 mr-2" />
                 Register Dealership
              </button>
              <div className="flex items-center justify-center space-x-2 text-slate-500 text-sm px-4">
                 <TrendingUp className="w-4 h-4" />
                 <span>Standard Plan Included</span>
              </div>
           </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:w-1/2 w-full max-w-md animate-in slide-in-from-right-10 duration-700 delay-100">
           <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
              <div className="text-center mb-8">
                 <div className="flex justify-center mb-4">
                    <Logo className="w-12 h-12" />
                 </div>
                 <h2 className="text-2xl font-bold text-white">Partner Login</h2>
                 <p className="text-slate-400 text-sm">Access your dealership dashboard</p>
              </div>

              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                    <div className="relative">
                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                       <input 
                         type="email" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                         placeholder="name@dealership.co.za"
                       />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                    <div className="relative">
                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                       <input 
                         type="password" 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                         placeholder="••••••••"
                       />
                    </div>
                 </div>

                 <button 
                   type="submit"
                   disabled={isLoading}
                   className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all border border-slate-700 flex items-center justify-center disabled:opacity-50"
                 >
                    {isLoading ? 'Authenticating...' : 'Sign In'}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                 </button>
              </form>

              {/* Demo Links */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                 <p className="text-center text-xs text-slate-600 mb-3 uppercase tracking-wider">Quick Fill (Demo)</p>
                 <div className="flex gap-2 justify-center flex-wrap">
                    <button onClick={() => fillCredentials('admin@autolead.co.za')} className="text-xs bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border border-blue-800/50 px-3 py-1.5 rounded transition-colors font-bold">
                        Super Admin
                    </button>
                    {dealers.slice(0, 2).map(d => (
                       <button key={d.id} onClick={() => fillCredentials(d.email)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-3 py-1.5 rounded transition-colors">
                          {d.brand} Dealer
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
