import {FC, useMemo} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {isNotEmpty} from '../../../../../../_metronic/helpers'
import {initialUser, User} from '../core/_models'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {createUser, updateUser} from '../core/_requests'
import {useQueryResponse} from '../core/QueryResponseProvider'

type Props = {
  isUserLoading: boolean
  user: User
}

const editUserSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Name is required'),
})

const UserEditModalForm: FC<Props> = ({user, isUserLoading}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()

  const userForEdit = useMemo<User>(
    () => ({
      ...initialUser,
      ...user,
      name: user.name || initialUser.name,
      email: user.email || initialUser.email,
    }),
    [user]
  )

  const isEditMode = isNotEmpty(userForEdit.id)

  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    enableReinitialize: true,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        if (isEditMode) {
          await updateUser(values)
        } else {
          await createUser(values)
        }

        setSubmitting(false)
        cancel(true)
      } catch (ex) {
        console.error(ex)
        setSubmitting(false)
      }
    },
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }

    setItemIdForUpdate(undefined)
  }

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          <div className='notice d-flex bg-light-primary rounded border-primary border border-dashed mb-10 p-5'>
            <div className='d-flex flex-stack flex-grow-1'>
              <div className='fw-semibold'>
                <div className='fs-6 text-gray-700'>
                  Staff records only need a name and email. The backend assigns the staff role
                  automatically.
                </div>
              </div>
            </div>
          </div>

          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Full Name</label>
            <input
              placeholder='Full name'
              {...formik.getFieldProps('name')}
              type='text'
              name='name'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.name && formik.errors.name},
                {'is-valid': formik.touched.name && !formik.errors.name}
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.name && formik.errors.name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.name}</span>
                </div>
              </div>
            )}
          </div>

          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Email</label>
            <input
              placeholder='Email'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.email && formik.errors.email},
                {'is-valid': formik.touched.email && !formik.errors.email}
              )}
              type='email'
              name='email'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isUserLoading}
          >
            Discard
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isUserLoading || formik.isSubmitting || !formik.isValid}
          >
            <span className='indicator-label'>
              {isEditMode ? 'Update Staff Member' : 'Create Staff Member'}
            </span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export {UserEditModalForm}
