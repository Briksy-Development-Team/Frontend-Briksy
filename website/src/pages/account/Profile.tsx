import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoaderCircle, UserCircle2 } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import { getSeekerProfile, updateSeekerProfile } from '../../seeker/seeker.api'

const toInputValue = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) {
    return ''
  }

  return String(value)
}

const Profile = () => {
  const { user, roles } = useAuth()
  const [currentPostcode, setCurrentPostcode] = useState('')
  const [preferredBudgetMin, setPreferredBudgetMin] = useState('')
  const [preferredBudgetMax, setPreferredBudgetMax] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true

    const load = async (): Promise<void> => {
      try {
        setLoading(true)
        setError('')
        const response = await getSeekerProfile()

        if (!active) {
          return
        }

        setCurrentPostcode(response.data.current_postcode ?? '')
        setPreferredBudgetMin(toInputValue(response.data.preferred_budget_min))
        setPreferredBudgetMax(toInputValue(response.data.preferred_budget_max))
      } catch (loadError) {
        console.error(loadError)
        if (active) {
          setError('We could not load your profile right now.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  const handleSave = async (): Promise<void> => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const response = await updateSeekerProfile({
        current_postcode: currentPostcode.trim() || null,
        preferred_budget_min: preferredBudgetMin.trim() ? Number(preferredBudgetMin) : null,
        preferred_budget_max: preferredBudgetMax.trim() ? Number(preferredBudgetMax) : null,
      })

      setCurrentPostcode(response.data.current_postcode ?? '')
      setPreferredBudgetMin(toInputValue(response.data.preferred_budget_min))
      setPreferredBudgetMax(toInputValue(response.data.preferred_budget_max))
      setSuccess('Profile updated successfully.')
    } catch (saveError) {
      console.error(saveError)
      setError('We could not save your profile right now.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-[#e7e1d8] bg-white p-6 shadow-[0_18px_50px_rgba(52,37,17,0.08)]">
        <p className="text-xs uppercase tracking-[0.24em] text-[#8b6f54]">Seeker profile</p>
        <h2 className="mt-2 text-3xl font-medium text-[#342511]">{user?.name ?? 'Account'}</h2>
        <p className="mt-2 text-sm text-[#7c5f42]">{user?.email}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {roles.map((role) => (
            <span key={role} className="rounded-full bg-[#eeece0] px-3 py-1 text-xs font-medium text-[#342511]">
              {role.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link to="/account/liked-properties" className="rounded-[1.5rem] border border-[#ede8e4] bg-[#fbfaf3] p-5 transition-colors hover:border-[#342511]">
          <p className="text-sm font-medium text-[#342511]">My Liked Properties</p>
          <p className="mt-2 text-sm text-[#7c5f42]">Review the properties you saved while browsing Briksy.</p>
        </Link>
        <Link to="/account/inquiries" className="rounded-[1.5rem] border border-[#ede8e4] bg-[#fbfaf3] p-5 transition-colors hover:border-[#342511]">
          <p className="text-sm font-medium text-[#342511]">My Inquiries</p>
          <p className="mt-2 text-sm text-[#7c5f42]">Track the enquiries you submitted and their latest status.</p>
        </Link>
      </section>

      <section className="rounded-[1.5rem] border border-[#e7e1d8] bg-white p-6">
        <div className="flex items-center gap-3">
          <UserCircle2 className="h-8 w-8 text-[#8b6f54]" />
          <div>
            <h3 className="text-lg font-medium text-[#342511]">Profile details</h3>
            <p className="text-sm text-[#7c5f42]">Update the details Briksy uses to tailor your seeker experience.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-40 items-center justify-center">
            <LoaderCircle className="h-6 w-6 animate-spin text-[#342511]" />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8b6f54]">Current postcode</span>
              <input
                value={currentPostcode}
                onChange={(e) => setCurrentPostcode(e.target.value)}
                className="w-full rounded-2xl border border-[#ede8e4] bg-white px-4 py-3 text-sm text-[#342511] outline-none transition-colors placeholder:text-[#a89f95] focus:border-[#342511]"
                placeholder="3000"
              />
            </label>

            <div />

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8b6f54]">Preferred budget minimum</span>
              <input
                type="number"
                min="0"
                value={preferredBudgetMin}
                onChange={(e) => setPreferredBudgetMin(e.target.value)}
                className="w-full rounded-2xl border border-[#ede8e4] bg-white px-4 py-3 text-sm text-[#342511] outline-none transition-colors placeholder:text-[#a89f95] focus:border-[#342511]"
                placeholder="400000"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8b6f54]">Preferred budget maximum</span>
              <input
                type="number"
                min="0"
                value={preferredBudgetMax}
                onChange={(e) => setPreferredBudgetMax(e.target.value)}
                className="w-full rounded-2xl border border-[#ede8e4] bg-white px-4 py-3 text-sm text-[#342511] outline-none transition-colors placeholder:text-[#a89f95] focus:border-[#342511]"
                placeholder="900000"
              />
            </label>
          </div>
        )}

        {error ? (
          <div className="mt-4 rounded-2xl border border-[#ecd7cf] bg-[#fff6f3] px-4 py-3 text-sm text-[#8b4d38]">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-4 rounded-2xl border border-[#d8eadf] bg-[#f2fbf4] px-4 py-3 text-sm text-[#2d6a46]">
            {success}
          </div>
        ) : null}

        {!loading ? (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-[#342511] px-5 py-3 text-sm font-medium text-[#eeece0] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {saving ? 'Saving' : 'Save changes'}
            </button>
          </div>
        ) : null}
      </section>

      <section className="rounded-[1.5rem] border border-[#e7e1d8] bg-white p-6">
        <h3 className="text-lg font-medium text-[#342511]">Account details</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-[#8b6f54]">Name</dt>
            <dd className="mt-1 text-sm text-[#342511]">{user?.name ?? '-'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-[#8b6f54]">Email</dt>
            <dd className="mt-1 text-sm text-[#342511]">{user?.email ?? '-'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-[#8b6f54]">Verification</dt>
            <dd className="mt-1 text-sm text-[#342511]">{user?.id_verified ? 'Verified' : 'Not verified yet'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-[#8b6f54]">Access</dt>
            <dd className="mt-1 text-sm text-[#342511]">Website seeker account</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

export default Profile
