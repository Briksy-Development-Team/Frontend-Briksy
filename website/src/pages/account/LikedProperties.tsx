import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, LoaderCircle, MapPin, Trash2 } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import {
  getSeekerFavorites,
  removeSeekerFavorite,
  type FavoriteItem,
  type FavoritePropertyTarget,
} from '../../seeker/seeker.api'

const mapPrimaryImage = (property: FavoritePropertyTarget): string | null => {
  return property.media?.find((media) => media.is_primary)?.url ?? property.media?.[0]?.url ?? null
}

const isPropertyTarget = (target: FavoriteItem['target']): target is FavoritePropertyTarget => {
  return Boolean(target && 'title' in target)
}

const LikedProperties = () => {
  const { isBootstrapping, isAuthenticated } = useAuth()
  const [items, setItems] = useState<Array<{ favorite: FavoriteItem; property: FavoritePropertyTarget }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingFavoriteId, setRemovingFavoriteId] = useState<string | null>(null)

  useEffect(() => {
    if (isBootstrapping || !isAuthenticated) {
      return
    }

    let active = true

    const load = async (): Promise<void> => {
      try {
        setLoading(true)
        setError('')
        const favoritesResponse = await getSeekerFavorites('property')
        const favorites = (favoritesResponse.data ?? [])
          .filter((item): item is FavoriteItem & { target: FavoritePropertyTarget } => item.type === 'property' && isPropertyTarget(item.target))
          .map((item) => ({
            favorite: item,
            property: item.target,
          }))

        if (!active) {
          return
        }

        setItems(favorites)
      } catch (loadError) {
        console.error(loadError)
        if (active) {
          setError('We could not load your liked properties right now.')
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

  const handleRemove = async (favoriteId: string): Promise<void> => {
    if (removingFavoriteId) {
      return
    }

    try {
      setRemovingFavoriteId(favoriteId)
      await removeSeekerFavorite(favoriteId)
      setItems((current) => current.filter((item) => item.favorite.id !== favoriteId))
    } catch (removeError) {
      console.error(removeError)
      setError('We could not remove that saved property right now.')
    } finally {
      setRemovingFavoriteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[1.5rem] border border-[#e7e1d8] bg-white p-6 shadow-[0_18px_50px_rgba(52,37,17,0.08)]">
        <p className="text-xs uppercase tracking-[0.24em] text-[#8b6f54]">Saved</p>
        <h2 className="mt-2 text-3xl font-medium text-[#342511]">My Liked Properties</h2>
        <p className="mt-2 text-sm text-[#7c5f42]">Properties you have saved while browsing Briksy.</p>
      </header>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-[1.5rem] border border-[#ede8e4] bg-white">
          <LoaderCircle className="h-6 w-6 animate-spin text-[#342511]" />
        </div>
      ) : error ? (
        <div className="rounded-[1.5rem] border border-[#ecd7cf] bg-[#fff6f3] p-6 text-sm text-[#8b4d38]">{error}</div>
      ) : items.length === 0 ? (
        <div className="rounded-[1.5rem] border border-[#ede8e4] bg-white p-8 text-center">
          <Heart className="mx-auto h-10 w-10 text-[#8b6f54]" />
          <h3 className="mt-4 text-lg font-medium text-[#342511]">You haven't liked any properties yet.</h3>
          <p className="mt-2 text-sm text-[#7c5f42]">Browse properties and tap the heart to save the ones you want to revisit.</p>
          <Link to="/result?type=property" className="mt-6 inline-flex rounded-full bg-[#342511] px-5 py-3 text-sm font-medium text-[#eeece0]">
            Browse properties
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map(({ favorite, property }) => {
            const image = mapPrimaryImage(property)
            const isRemoving = removingFavoriteId === favorite.id

            return (
              <article
                key={favorite.id}
                className="overflow-hidden rounded-[1.5rem] border border-[#ede8e4] bg-white p-4 transition-colors hover:border-[#342511]"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link to={`/property/${property.id}`} className="flex min-w-0 flex-1 gap-4">
                    <div className="h-40 w-full overflow-hidden rounded-[1rem] bg-[#f3eee7] sm:h-36 sm:w-48 sm:shrink-0">
                      {image ? (
                        <img src={image} alt={property.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#8b6f54]">
                          <Heart className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-[#8b6f54]">Property</p>
                          <h3 className="mt-2 text-xl font-medium text-[#342511]">{property.title}</h3>
                        </div>
                        <span className="rounded-full bg-[#eeece0] px-3 py-1 text-xs font-medium text-[#342511]">Saved</span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#7c5f42]">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {property.location?.suburb ?? property.address ?? 'Location unavailable'}
                        </span>
                        {property.location?.postcode ? <span>{property.location.postcode}</span> : null}
                        {property.organization?.name ? <span>{property.organization.name}</span> : null}
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-start justify-end">
                    <button
                      type="button"
                      onClick={() => void handleRemove(favorite.id)}
                      disabled={isRemoving}
                      className="inline-flex items-center gap-2 rounded-full border border-[#ede8e4] px-4 py-2 text-sm font-medium text-[#342511] transition-colors hover:border-[#342511] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isRemoving ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LikedProperties
