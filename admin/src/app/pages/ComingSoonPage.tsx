import { FC } from 'react'
import { PageTitle } from '../../_metronic/layout/core'

type ComingSoonPageProps = {
  title: string
  description: string
}

const ComingSoonPage: FC<ComingSoonPageProps> = ({ title, description }) => {
  return (
    <div className="container-xxl">
      <PageTitle breadcrumbs={[]}>{title}</PageTitle>
      <div className="row justify-content-center">
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-10 p-lg-14 text-center">
              <div className="badge badge-light-primary fs-7 fw-semibold mb-6">Coming Soon</div>
              <h1 className="fw-bolder mb-4">{title}</h1>
              <p className="text-muted fs-5 mb-0">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ComingSoonPage }
