import { FC } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'
import { Dropdown1 } from '../../content/dropdown/Dropdown1'

type Props = {
  className: string
}

const products = [
  {
    name: 'Cup & Green',
    description: 'Visually stunning',
    rating: '4.2',
    image: 'media/avatars/300-1.jpg',
  },
  {
    name: 'Pink Patterns',
    description: 'Feminine all around',
    rating: '5.0',
    image: 'media/avatars/300-2.jpg',
  },
  {
    name: 'Abstract Art',
    description: 'The will to capture readers',
    rating: '5.7',
    image: 'media/avatars/300-3.jpg',
  },
  {
    name: 'Desserts platter',
    description: 'Food trends & inspirations',
    rating: '3.7',
    image: 'media/avatars/300-4.jpg',
  },
  {
    name: 'Pink Patterns',
    description: 'Feminine all around',
    rating: '5.0',
    image: 'media/avatars/300-2.jpg',
  },
]

const ListsWidget8: FC<Props> = () => {
  return (
    <div className='card card-xl-stretch mb-5 mb-xl-8'>
      {/* Header */}
      <div className='card-header align-items-center border-0 mt-4'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='fw-bold text-gray-900'>Top Rated</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
           Organization/Trades and Professional
          </span>
        </h3>

        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button>

          <Dropdown1 />
        </div>
      </div>

      {/* Body */}
      <div className='card-body pt-3'>
        {products.map((product, index) => (
          <div
            key={index}
            className={`d-flex align-items-sm-center ${index !== products.length - 1 ? 'mb-7' : ''
              }`}
          >
            {/* Image */}
            <div className='symbol symbol-60px symbol-2by3 me-4'>
              <div
                className='symbol-label'
                style={{
                  backgroundImage: `url(${toAbsoluteUrl(product.image)})`,
                }}
              />
            </div>

            {/* Content */}
            <div className='d-flex flex-row-fluid align-items-center flex-wrap my-lg-0 me-2'>
              <div className='flex-grow-1 my-lg-0 my-2 me-2'>
                <a
                  href='#'
                  className='text-gray-800 fw-bold text-hover-primary fs-6'
                >
                  {product.name}
                </a>

                <span className='text-muted fw-semibold d-block pt-1'>
                  {product.description}
                </span>
              </div>

              <div className='d-flex align-items-center'>
                <div className='me-6'>
                  <i className='fa fa-star-half-alt me-1 text-warning fs-5'></i>
                  <span className='text-gray-800 fw-bold'>
                    {product.rating}
                  </span>
                </div>

                <a href='#' className='btn btn-icon btn-light btn-sm border-0'>
                  <KTIcon
                    iconName='arrow-right'
                    className='fs-2 text-primary'
                  />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { ListsWidget8 }
