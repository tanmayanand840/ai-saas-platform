import { useAuth } from "@clerk/clerk-react";
import { Crown, LoaderCircle } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

export const hasPremiumAccess = (has) => {
  try {
    return typeof has === "function" && has({ plan: "premium" });
  } catch {
    return false;
  }
};

export const PremiumUpgrade = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-full min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-md w-full text-center bg-white/90 rounded-3xl shadow-xl p-8 border border-amber-100">
        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
          <Crown className="w-8 h-8" />
        </div>
        <span className="inline-flex rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold tracking-wide">★ PREMIUM</span>
        <h1 className="mt-4 text-2xl font-bold text-slate-800">Premium Feature</h1>
        <p className="mt-3 text-slate-600">This AI tool is available exclusively to Premium members.</p>
        <div className="mt-7 flex justify-center gap-3">
          <button onClick={() => navigate("/ai/upgrade")} className="rounded-xl px-5 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">Upgrade to Premium</button>
          <button onClick={() => navigate("/ai")} className="rounded-xl px-5 py-3 font-semibold text-slate-700 bg-slate-100">Go Back</button>
        </div>
      </div>
    </div>
  );
};

const PremiumRoute = ({ children }) => {
  const { has, isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center"><LoaderCircle className="animate-spin" /></div>;
  if (!isSignedIn) return <Navigate to="/" replace />;
  return hasPremiumAccess(has) ? children : <PremiumUpgrade />;
};

export default PremiumRoute;
