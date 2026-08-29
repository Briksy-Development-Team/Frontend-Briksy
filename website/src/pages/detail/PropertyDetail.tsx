import { useState } from 'react'
import { Heart, MapPin, Bed, Bath, Square, Phone, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../../components/nav/Breadcrumb'
import { useAuth } from '../../auth/AuthContext'
import { storePendingFavoriteAction } from '../../auth/auth.intent'
import { isLocalFavorite } from '../../favorites/localFavorites'
import { toggleSeekerPropertyFavorite } from '../../seeker/seeker.api'

const property = {
  title: '4 Bedroom Family Home with Pool',
  address: '12 Maple Street, Toorak VIC 3142',
  price: 1_850_000,
  beds: 4,
  baths: 3,
  sqm: 420,
  badge: 'For Sale',
  description:
    "A stunning family home nestled in one of Melbourne's most prestigious streets. Featuring light-filled open-plan living, a gourmet kitchen with stone benchtops, and a resort-style pool perfect for entertaining. Close to elite schools, boutique shopping, and public transport.",
  images: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=900&q=80',
  ],
  agent: {
    name: 'Sarah Mitchell',
    avatar: 'https://i.pravatar.cc/80?img=47',
    agency: 'Ray White Toorak',
    phone: '+61 412 000 111',
    email: 'sarah@raywhite.com.au',
  },
  features: ['Pool', 'Double Garage', 'Ducted Heating', 'Alfresco Dining', 'Study', 'Powder Room'],
}

const PropertyDetail = () => {
  const { isAuthenticated, isSeeker } = useAuth()
  const navigate = useNavigate()
  const [isFavourite, setIsFavourite] = useState(() => isLocalFavorite(1))
  const [isProcessing, setIsProcessing] = useState(false)

  const addressParts = property.address.split(', ')
  const suburbStateZip = addressParts[addressParts.length - 1].split(' ')
  const state = suburbStateZip[suburbStateZip.length - 2] || 'Victoria'
  const suburb = suburbStateZip.slice(0, -2).join(' ') || 'Toorak'

  const toggleFavourite = async () => {
    if (isProcessing) {
      return
    }

    if (!isAuthenticated || !isSeeker) {
      storePendingFavoriteAction('1', window.location.pathname)
      navigate('/login')
      return
    }

    try {
      setIsProcessing(true)
      const result = await toggleSeekerPropertyFavorite('1')
      setIsFavourite(result.isFavourite)
    } catch (error) {
      console.error('Failed to toggle favourite.', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Buy', isBack: true },
    { label: 'New property' },
    { label: state },
    { label: suburb },
    { label: property.title },
  ]

  return (
    <div className="min-h-screen bg-white-50 pb-16 font-helvetica">
      <div className="mx-auto max-w-5xl px-4 pt-8">
        <Breadcrumb items={breadcrumbs} />

        <div className="grid h-[420px] grid-cols-3 overflow-hidden rounded-2xl gap-2">
          <img src={property.images[0]} className="col-span-2 h-full w-full object-cover" alt="" />
          <div className="flex flex-col gap-2">
            <img src={property.images[1]} className="flex-1 w-full object-cover" alt="" />
            <img src={property.images[2]} className="flex-1 w-full object-cover" alt="" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <div>
              <span className="rounded-full bg-primary-brown px-3 py-1 text-xs font-medium text-white">{property.badge}</span>
              <h1 className="mt-3 text-2xl font-bold text-primary-brown">{property.title}</h1>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-primary-light-brown">
                <MapPin size={14} />
                {property.address}
              </div>
            </div>

            <div className="flex gap-6 text-primary-brown">
              <div className="flex items-center gap-2"><Bed size={18} /><span className="font-semibold">{property.beds}</span><span className="text-sm text-primary-light-brown">Beds</span></div>
              <div className="flex items-center gap-2"><Bath size={18} /><span className="font-semibold">{property.baths}</span><span className="text-sm text-primary-light-brown">Baths</span></div>
              <div className="flex items-center gap-2"><Square size={18} /><span className="font-semibold">{property.sqm}</span><span className="text-sm text-primary-light-brown">sqm</span></div>
            </div>

            <div>
              <h2 className="mb-2 font-semibold text-primary-brown">About this property</h2>
              <p className="text-sm leading-relaxed text-primary-light-brown">{property.description}</p>
            </div>

            <div>
              <h2 className="mb-3 font-semibold text-primary-brown">Features</h2>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature) => (
                  <span key={feature} className="rounded-full border border-white-100 px-3 py-1.5 text-xs text-primary-brown">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-4 rounded-2xl border border-white-100 bg-white p-5">
              <p className="text-2xl font-bold text-primary-brown">${property.price.toLocaleString()}</p>
              <div className="border-t border-white-100" />
              <div className="flex items-center gap-3">
                <img src={property.agent.avatar} className="h-12 w-12 rounded-full object-cover" alt="" />
                <div>
                  <p className="text-sm font-semibold text-primary-brown">{property.agent.name}</p>
                  <p className="text-xs text-primary-light-brown">{property.agent.agency}</p>
                </div>
              </div>
              <a href={`tel:${property.agent.phone}`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-brown px-4 py-2.5 text-sm text-white transition-opacity hover:opacity-90">
                <Phone size={15} /> Call agent
              </a>
              <a href={`mailto:${property.agent.email}`} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white-100 px-4 py-2.5 text-sm text-primary-brown transition-colors hover:bg-white-50">
                <Mail size={15} /> Email agent
              </a>
            </div>

            <button
              type="button"
              onClick={() => void toggleFavourite()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white-100 bg-white px-4 py-2.5 text-sm text-primary-brown transition-colors hover:bg-white-50"
            >
              {isProcessing ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
                  Saving
                </span>
              ) : (
                <>
                  <Heart size={15} className={isFavourite ? 'fill-primary-brown text-primary-brown' : ''} />
                  {isFavourite ? 'Saved property' : 'Save property'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail
