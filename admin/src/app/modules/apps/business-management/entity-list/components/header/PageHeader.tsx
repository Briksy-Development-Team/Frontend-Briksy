type Props = {
  title: string
  subtitle?: string
}

const PageHeader = ({ title, subtitle }: Props) => {
  return (
    <div className="mb-5">
      <h1 className="fs-hx fw-bold">{title}</h1>

      {subtitle && (
        <div className="text-muted fs-6">
          {subtitle}
        </div>
      )}
    </div>
  )
}

export { PageHeader }