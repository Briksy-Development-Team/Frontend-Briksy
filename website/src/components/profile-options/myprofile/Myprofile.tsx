import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "../../../auth/AuthContext";
import { getSeekerProfile, updateSeekerProfile } from "../../../api/seeker/seeker.api";

const Myprofile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');

  useEffect(() => {
    if (user?.name) {
      const parts = user.name.split(' ');
      setFirstName(parts[0] ?? '');
      setLastName(parts.slice(1).join(' '));
    }
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getSeekerProfile();
        setBudgetMin(res.data?.preferred_budget_min?.toString() || '');
        setBudgetMax(res.data?.preferred_budget_max?.toString() || '');
      } catch (err) {
        console.error("Failed to load profile details", err);
      } finally {
        setLoading(false);
      }
    };
    void fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      await updateSeekerProfile({
        preferred_budget_min: budgetMin ? parseInt(budgetMin, 10) : null,
        preferred_budget_max: budgetMax ? parseInt(budgetMax, 10) : null,
        current_postcode: null, // Add to UI if needed
      });
      setMessage('Profile saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save profile.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full mx-auto font-helvetica space-y-[2.5rem]">
      <div className="w-full h-auto flex justify-between items-center">
        <h1 className="text-[1.875rem] hidden md:flex pb-5 font-medium text-primary-brown">
          About
        </h1>
        <div className="flex items-center gap-3">
          {message && <span className={`text-sm ${message.includes('Failed') ? 'text-red-500' : 'text-green-600'}`}>{message}</span>}
          <button onClick={() => void handleSave()} disabled={saving || loading} className="flex items-center gap-2  hidden md:flex bg-primary-brown text-white px-4 py-3 rounded-xl disabled:opacity-70 transition-opacity">
            {saving && <LoaderCircle className="w-4 h-4 animate-spin" />}
            Save Profile
          </button>
        </div>
      </div>

      {!user?.id_verified && (
        <div className="w-full rounded-xl hidden md:flex bg-[#dbd0c7] px-7 py-4  items-center gap-5">
          <span className="w-9 h-9 rounded-full bg-[#E2CBB3] flex items-center justify-center text-[#3D2B1F]">i</span>
          <p className="text-sm text-[#3D2B1F]">Please verify your mobile number to access all features.</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-primary-light-brown">
          <LoaderCircle className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row w-full h-full gap-8 md:gap-0">
          <div className="w-full md:w-[30%] flex flex-col items-center space-y-[0.75rem]">
            {user?.avatar_url ? (
              <img src={user.avatar_url} className="w-[104px] h-[104px] md:w-[14.75rem] md:h-[14.75rem] rounded-full object-cover shadow-sm" alt={user.name} />
            ) : (
              <div className="w-[104px] h-[104px] md:w-[14.75rem] md:h-[14.75rem] rounded-full bg-[#342511] flex items-center justify-center text-white text-4xl md:text-7xl font-semibold shadow-sm">
                {user?.name ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "?"}
              </div>
            )}
            <button className="px-5 py-2 md:py-3 bg-white rounded-[0.5rem] border-[1.5px] border-[#E7E7E4] text-primary-brown font-medium text-[14px] md:text-base transition-colors hover:bg-gray-50">
              Change Profile Picture
            </button>
          </div>

          <div className="w-full md:w-[70%]">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 md:gap-y-6 pt-2 md:pt-6" onSubmit={e => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <label className="text-[0.875rem] text-[#8E8B82]">First name</label>
                <input type="text" value={firstName} readOnly className="h-[2.875rem] rounded-xl border border-[#C8C5BD] bg-gray-50 px-4 text-[1rem] font-medium text-[#30291F] outline-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[0.875rem] text-[#8E8B82]">Last name</label>
                <input type="text" value={lastName} readOnly className="h-[2.875rem] rounded-xl border border-[#C8C5BD] bg-gray-50 px-4 text-[1rem] font-medium text-[#30291F] outline-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[0.875rem] text-[#8E8B82]">Email</label>
                <input type="email" value={user?.email || ''} readOnly className="h-[2.875rem] rounded-xl border border-[#C8C5BD] bg-gray-50 px-4 text-[1rem] text-[#30291F] outline-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[0.875rem] text-[#8E8B82]">Phone No.</label>
                <div className="relative">
                  <input type="tel" value={user?.mobile_number || ''} readOnly placeholder="No phone added" className="h-[2.875rem] w-full rounded-xl border border-[#C8C5BD] bg-gray-50 px-4 pr-32 text-[1rem] text-[#30291F] outline-none" />
                  {!user?.id_verified ? (
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.875rem] font-medium text-red-600 hover:opacity-75">
                      Verify Now
                    </button>
                  ) : (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.875rem] font-medium text-green-600">Verified</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[0.875rem] text-[#8E8B82]">Min Budget ($)</label>
                <input type="number" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} placeholder="0" className="h-[2.875rem] rounded-xl border border-[#C8C5BD] bg-white px-4 text-[1rem] text-[#30291F] outline-none focus:border-primary-brown" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[0.875rem] text-[#8E8B82]">Max Budget ($)</label>
                <input type="number" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} placeholder="Any" className="h-[2.875rem] rounded-xl border border-[#C8C5BD] bg-white px-4 text-[1rem] text-[#30291F] outline-none focus:border-primary-brown" />
              </div>
            </form>
            <button onClick={() => void handleSave()} disabled={saving || loading} className="flex items-center gap-2 mt-3 mx-auto w-full  justify-center  md:hidden bg-primary-brown text-white px-4 py-[0.9375rem] rounded-[62.4375rem] disabled:opacity-70 transition-opacity">
              {saving && <LoaderCircle className="w-4 h-4 animate-spin" />}
              Save Profile
            </button>
          </div>
        </div>
      )}

      <div className="w-full rounded-xl bg-white p-4 md:p-6  flex-wrap hidden md:flex  md:justify-between items-center shadow-sm border border-[#F0EBE5]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[0.875rem] text-primary-brown truncate max-w-[150px] md:max-w-none">{user?.email}</span>
            <span className="text-[0.75rem] bg-[#E2CBB3] text-[#3D2B1F] px-2 py-0.5 rounded-full whitespace-nowrap">✓ Verified</span>
          </div>
          <p className="text-xs text-primary-light-brown mt-1">We use this to sign you in.</p>
        </div>
        <button className="text-[0.75rem] text-primary-brown hover:underline whitespace-nowrap ml-2">Change email ›</button>
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="text-[1.25rem] font-medium text-primary-brown">Password</h2>
          <p className="text-[0.75rem] text-primary-brown">Briksy is password-less.</p>
        </div>
        <div className="w-full rounded-xl bg-white p-4 md:p-6 shadow-sm border border-[#F0EBE5]">
          <p className=" text-[0.875rem] md:text-[1rem] text-primary-brown">
            There's no password to update. When you sign in, enter your email address and we'll send a single-use verification code.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-[0.875rem] md:text-[1rem] font-medium text-primary-brown">Security</h2>
        <div className="w-full rounded-xl   divide-y divide-[#E7E7E4]">
          <div className="flex-col flex md:flex-row rounded-[0.875rem]  border bg-white border-[#F0EBE5] justify-between  items-center p-4 md:p-6">
            <div>
              <p className="font-medium text-primary-brown text-[0.875rem]">Sign out everywhere</p>
              <p className="text-xs text-primary-light-brown text-[0.75rem]">
                Lost a device, or signed in on a public computer? Sign out on all devices to protect your account.
              </p>
            </div>
            <button className="px-6 py-[0.9375rem] mt-2 md:mt-0 w-full md:w-auto rounded-full border border-[#C8C5BD] text-[0.875rem] text-primary-brown hover:bg-gray-50 transition-colors">
              Sign out on all devices
            </button>
          </div>
          <div className=" flex flex-col mt-4   border bg-white rounded-[0.875rem] border-[#F0EBE5] md:flex-row justify-between items-center p-4 md:p-6">
            <div>
              <p className="font-medium text-primary-brown text-[0.875rem]">Delete account</p>
              <p className="text-xs text-primary-light-brown text-[0.75rem]">
                Permanently removes your profile, saved searches, enquiries and reviews. This can't be undone.
              </p>
            </div>
            <button className="px-6 py-[0.9375rem] w-full md:w-auto mt-2 md:mt-0 rounded-full border border-red-400 text-sm text-red-500 hover:bg-red-50 transition-colors">
              Delete account
            </button>
          </div>
        </div>
      </div>

      <div className="w-full rounded-xl bg-[#EEECE0] p-4 md:p-6 flex flex-col md:flex-row justify-between items-center border border-[#E7E1D8]">
        <div>
          <p className="font-medium text-[0.875rem] text-primary-brown">Data and privacy, made simple</p>
          <p className="text-[0.75rem] text-primary-light-brown">See what we collect, how it's used, and what you can turn off.</p>
        </div>
        <button className="bg-primary-brown w-full md:w-auto mt-2 text-white px-6 py-[0.9375rem] rounded-full hover:bg-primary-brown/90 transition-colors">
          Go to Privacy Centre
        </button>
      </div>
    </div>
  );
};

export default Myprofile;