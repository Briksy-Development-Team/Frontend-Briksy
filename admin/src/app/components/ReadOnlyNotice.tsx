type ReadOnlyNoticeProps = {
  message: string
}

const ReadOnlyNotice = ({ message }: ReadOnlyNoticeProps) => {
  return (
    <div className='alert alert-warning d-flex align-items-center mb-5'>
      <span className='fw-semibold'>{message}</span>
    </div>
  )
}

export { ReadOnlyNotice }
