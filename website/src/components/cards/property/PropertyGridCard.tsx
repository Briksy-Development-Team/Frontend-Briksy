import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Heart, LoaderCircle } from 'lucide-react'
import type { Property } from '../../../types/property'
import { useAuth } from '../../../auth/AuthContext'
import { storePendingFavoriteAction } from '../../../auth/auth.intent'
import { isLocalFavorite } from '../../../favorites/localFavorites'
import { toggleSeekerPropertyFavorite } from '../../../seeker/seeker.api'

type Props = {
  item: Property
}

const PropertyGridCard = ({ item }: Props) => {
  const { isAuthenticated, isSeeker } = useAuth();
  const navigate = useNavigate();
  const [isFavourite, setIsFavourite] = useState(() => isLocalFavorite(item.id) || item.isFavourite);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFavouriteClick = async () => {
    if (isProcessing) {
      return
    }

    if (!isAuthenticated || !isSeeker) {
      storePendingFavoriteAction(String(item.id), `/property/${item.id}`)
      navigate('/login')
      return
    }

    try {
      setIsProcessing(true)
      const result = await toggleSeekerPropertyFavorite(String(item.id))
      setIsFavourite(result.isFavourite)
    } catch (error) {
      console.error('Failed to toggle favourite.', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Link to={`/property/${item.id}`} className="mx-auto flex h-[25rem] w-full flex-col overflow-hidden rounded-3xl border border-transparent bg-white text-left text-primary-brown transition-colors duration-200 hover:border-primary">
    <div className="relative h-[60%] shrink-0 overflow-hidden">
      <img loading="lazy"
        src={item.image}
        alt={item.title}
        className="h-full w-full object-cover"
      />

      {item.badge && (
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[0.75rem] font-medium">
          {item.badge}
        </span>
      )}

      <button
        type="button"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void handleFavouriteClick()
        }}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/85"
        aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
      >
        {isProcessing ? (
          <LoaderCircle className="h-4 w-4 animate-spin text-primary-brown" />
        ) : (
          <Heart
            size={18}
            className={
              isFavourite
                ? 'fill-primary-brown text-primary-brown'
                : 'fill-transparent text-primary-brown stroke-[1.5]'
            }
          />
        )}
      </button>
    </div>

    
    <div className="flex min-h-0 flex-1 flex-col p-4">
      <h3 className="line-clamp-2 text-[0.9375rem] font-bold leading-[1.3] lg:text-[1.0625rem]">
        {item.title}
      </h3>

      <p className="mt-2 text-[1rem] font-bold">
        ${item.price.toLocaleString()}
      </p>

      <p className="mt-1 truncate text-[0.875rem] text-primary-brown">
        {item.beds} Bed&nbsp;&nbsp;•&nbsp;&nbsp;{item.baths} Bath&nbsp;&nbsp;•&nbsp;&nbsp;{item.sqm} sqm
      </p>

      
      <div className="mt-auto">
        <div className="w-full border-t border-primary-light-brown/70" />

        <div className="mt-3 flex w-full items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <img loading="lazy"
              src={item.posterAvatar}
              alt={item.posterName}
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
            <span className="min-w-0 truncate text-[0.875rem]">
              Listed by <span className="font-bold">{item.posterName}</span>
            </span>
          </div>
          <ArrowRight size={18} className="shrink-0 text-primary-light-brown/70" />
        </div>
      </div>
    </div>
    </Link>
  )
}

export default PropertyGridCard
