import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoaderCircle, MessageSquareText, Phone, Mail, MapPin } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import { getSeekerInquiries, type InquiryItem } from '../../seeker/seeker.api'

const formatDate = (value?: string): string => {
  if (!value) return 'Unknown'

  try {
    return new Intl.DateTimeFormat('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return value
  }
}

const getInquiryTargetLabel = (item: InquiryItem): string => {
  return item.property?.title ?? item.organization?.name ?? 'Direct inquiry'
}

const getInquiryContact = (item: InquiryItem): { email: string | null; phone: string | null } | null => {
  return item.property?.organization?.contact ?? item.organization?.contact ?? null
}

const Inquiries = () => {
  const { isBootstrapping, isAuthenticated } = useAuth()
  const [items, setItems] = useState<InquiryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isBootstrapping || !isAuthenticated) {
      return
    }

    let active = true

    const load = async (): Promise<void> => {
      try {
        setLoading(true)
        setError('')
        const response = await getSeekerInquiries()

        if (!active) return

        setItems(response.data ?? [])
      } catch (loadError) {
        console.error(loadError)
        if (active) {
          setError('We could not load your inquiries right now.')
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
  }, [isAuthenticated, isBootstrapping])

  return (
    <div className="space-y-6">
      <header className="rounded-[1.5rem] border border-[#e7e1d8] bg-white p-6 shadow-[0_18px_50px_rgba(52,37,17,0.08)]">
        <p className="text-xs uppercase tracking-[0.24em] text-[#8b6f54]">Support</p>
        <h2 className="mt-2 text-3xl font-medium text-[#342511]">My Inquiries</h2>
        <p className="mt-2 text-sm text-[#7c5f42]">Track the messages and requests you sent through Briksy.</p>
      </header>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-[1.5rem] border border-[#ede8e4] bg-white">
          <LoaderCircle className="h-6 w-6 animate-spin text-[#342511]" />
        </div>
      ) : error ? (
        <div className="rounded-[1.5rem] border border-[#ecd7cf] bg-[#fff6f3] p-6 text-sm text-[#8b4d38]">{error}</div>
      ) : items.length === 0 ? (
        <div className="rounded-[1.5rem] border border-[#ede8e4] bg-white p-8 text-center">
          <MessageSquareText className="mx-auto h-10 w-10 text-[#8b6f54]" />
          <h3 className="mt-4 text-lg font-medium text-[#342511]">You haven't submitted any inquiries yet.</h3>
          <p className="mt-2 text-sm text-[#7c5f42]">Open a property or service listing and send an inquiry to see it here.</p>
          <Link to="/result?type=property" className="mt-6 inline-flex rounded-full bg-[#342511] px-5 py-3 text-sm font-medium text-[#eeece0]">
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const targetLabel = getInquiryTargetLabel(item)
            const contact = getInquiryContact(item)

            return (
              <article key={item.id} className="rounded-[1.5rem] border border-[#ede8e4] bg-white p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#8b6f54]">
                      {item.lead_source === 'property_listing' ? 'Property' : item.lead_source === 'organization' ? 'Service' : 'Inquiry'}
                    </p>
                    <h3 className="mt-2 text-xl font-medium text-[#342511]">{item.subject}</h3>
                    <p className="mt-2 text-sm text-[#7c5f42]">{item.message}</p>
                  </div>
                  <span className="inline-flex rounded-full bg-[#eeece0] px-3 py-1 text-xs font-medium text-[#342511]">
                    {item.status}
                  </span>
                </div>

                <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-[#8b6f54]">Property / Service</dt>
                    <dd className="mt-1 text-sm text-[#342511]">{targetLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-[#8b6f54]">Inquiry Date</dt>
                    <dd className="mt-1 text-sm text-[#342511]">{formatDate(item.created_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-[#8b6f54]">Latest update</dt>
                    <dd className="mt-1 space-y-1 text-sm text-[#342511]">
                      <p>{item.latest_update.message}</p>
                      <p className="text-xs text-[#7c5f42]">{formatDate(item.latest_update.at ?? undefined)}</p>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-[#8b6f54]">Contact</dt>
                    <dd className="mt-1 space-y-2 text-sm text-[#342511]">
                      {contact?.phone ? (
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-[#342511]">
                          <Phone className="h-4 w-4" />
                          {contact.phone}
                        </a>
                      ) : null}
                      {contact?.email ? (
                        <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-[#342511]">
                          <Mail className="h-4 w-4" />
                          {contact.email}
                        </a>
                      ) : null}
                      {!contact?.phone && !contact?.email ? <span className="text-[#7c5f42]">Unavailable</span> : null}
                    </dd>
                  </div>
                </dl>

                {(item.property?.address || item.property?.full_address || item.property?.organization?.name) ? (
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#7c5f42]">
                    {item.property?.full_address || item.property?.address ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {item.property.full_address ?? item.property.address}
                      </span>
                    ) : null}
                    {item.property?.organization?.name ? <span>{item.property.organization.name}</span> : null}
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Inquiries
