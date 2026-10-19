import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Bookmark02Icon } from '@hugeicons/core-free-icons'
import type { Property } from '../../../types/property'
import Mappin from '../../../assets/icons/location.svg'
import { SafeImage } from '../../custom/SafeImage'
import { useAuth } from '../../../auth/AuthContext'
import { toggleSeekerFavorite } from '../../../api/seeker/seeker.api'
import CollectionModal from '../../collections/CollectionModal'
import AuthPromptToast from '../../custom/AuthPromptToast'
import { propertyStatusLabel } from '../../../utils/propertyStatus'
import { formatPropertyPrice } from '../../../utils/propertyPrice'

type Props = {
  item: Property
}

// Mobile: one line cut with "..."  |  md and above: show full text
const clip = 'truncate md:overflow-visible md:text-clip md:whitespace-normal'

const PropertyListCard = ({ item }: Props) => {
  const { isAuthenticated, isSeeker } = useAuth();
  const [isFavourite, setIsFavourite] = useState(item.isFavourite);
  const [isProcessing, setIsProcessing] = useState(false);
  const [collectionPromptOpen, setCollectionPromptOpen] = useState(false);
  const [showAuthToast, setShowAuthToast] = useState(false);

  const handleFavouriteClick = async () => {
    if (isProcessing) {
      return
    }

    if (!isAuthenticated || !isSeeker) {
      setShowAuthToast(true);
      return
    }

    try {
      setIsProcessing(true)
      const result = await toggleSeekerFavorite(String(item.id), 'property')
      setIsFavourite(result.data.action === 'added')
      if (result.data.action === 'added' && result.data.collection_selection_required) {
        setCollectionPromptOpen(true)
      }
    } catch (error) {
      console.error('Failed to toggle favourite.', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Link to={`/property/${item.id}`} className="flex items-center gap-3 rounded-[1.25rem] border border-[#E7E7E4] bg-white px-2 py-2 font-helvetica lg:gap-4 hover:border hover:border-primary">
        <div className="relative w-[100px] aspect-4/5 shrink-0 overflow-hidden rounded-2xl">
          <SafeImage loading="lazy"
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
          <span className="absolute right-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-[0.625rem] font-medium">
            {item.isAuction ? "Auction" : propertyStatusLabel(item.purpose, item.transactionStatus, item.badge)}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              void handleFavouriteClick()
            }}
            className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/85"
            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          >
            {isProcessing ? (
              <LoaderCircle className="h-3 w-3 animate-spin text-primary-brown" />
            ) : (
              <HugeiconsIcon
                icon={Bookmark02Icon}
                size={14}
                className={isFavourite ? 'fill-primary-brown text-primary-brown' : 'fill-transparent text-primary-brown stroke-[1.5]'}
              />
            )}
          </button>
        </div>

        <div className="flex min-w-0 flex-1 flex-col text-primary-brown">
          <h3 className="line-clamp-1 md:line-clamp-2 text-[0.875rem] font-medium">
            {item.title}
          </h3>

          <div className="flex items-center gap-1 text-[0.75rem] ">
            <img loading="lazy" src={Mappin} alt="" className="shrink-0" />
            <span className={`min-w-0 ${clip}`}>{item.address}</span>
          </div>

          <p className={`text-[1rem] font-medium ${clip}`}>
            {formatPropertyPrice({ pricing_type: item.pricingType, price: item.price, price_min: item.priceMin, price_max: item.priceMax })}
          </p>

          <p className={`text-[0.75rem] ${clip}`}>
            {item.propertyType && `${item.propertyType} • `}
            {item.beds} Bed&nbsp;&nbsp;•&nbsp;&nbsp;{item.baths} Bath&nbsp;&nbsp;•&nbsp;&nbsp;{item.sqm} sqm
          </p>

          <div className="w-full my-2 border-t border-primary-light-brown/70" />

          <div className="flex w-full items-center justify-between ">
            <div className="flex min-w-0 items-center gap-1">
              <SafeImage loading="lazy"
                src={item.posterAvatar}
                alt={item.posterName}
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
              <span className={`text-[0.75rem] ${clip}`}>
                Listed by <span className="font-medium">{item.posterName}</span>
              </span>
            </div>
            <ArrowRight size={18} className="shrink-0 text-primary-light-brown/70" />
          </div>
        </div>
      </Link>
      {collectionPromptOpen && (
        <CollectionModal
          propertyId={String(item.id)}
          targetType="property"
          onClose={() => setCollectionPromptOpen(false)}
        />
      )}
      <AuthPromptToast
        isOpen={showAuthToast}
        onClose={() => setShowAuthToast(false)}
        targetId={item.id}
        targetType="property"
      />
    </>
  )
}

export default PropertyListCard