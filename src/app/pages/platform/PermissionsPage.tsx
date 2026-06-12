import { useEffect, useMemo, useState } from 'react'
import { PermissionGuard, usePermissionAccess } from '../../modules/auth'
import {
  fetchPermissionsApi,
  fetchRolesApi,
  fetchRolePermissionsApi,
  fetchUsersApi,
  fetchUserPermissionsApi,
  syncRolePermissionsApi,
  syncUserPermissionsApi,
} from '../../services/features/permissions/permission.api'
import type { Permission, PermissionGroup, RoleSummary, UserPermissionSnapshot } from '../../services/features/permissions/permission.types'

const flattenPermissionIds = (groups: PermissionGroup[]) =>
  groups.flatMap((group) => group.permissions.map((permission) => permission.id))

const PermissionsPageContent = () => {
  const { hasPermission } = usePermissionAccess()
  const [loading, setLoading] = useState(false)
  const [savingRole, setSavingRole] = useState(false)
  const [savingUser, setSavingUser] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [grouped, setGrouped] = useState<PermissionGroup[]>([])
  const [roles, setRoles] = useState<RoleSummary[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [rolePermissionIds, setRolePermissionIds] = useState<string[]>([])
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string }>>([])
  const [userSearch, setUserSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [userSnapshot, setUserSnapshot] = useState<UserPermissionSnapshot | null>(null)
  const [userOverrides, setUserOverrides] = useState<Record<string, 'allow' | 'deny' | ''>>({})

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true)
      setError(null)
      try {
        const [permissionsRes, rolesRes, usersRes] = await Promise.all([
          fetchPermissionsApi(),
          fetchRolesApi(),
          fetchUsersApi(),
        ])
        setPermissions(permissionsRes.data.items)
        setGrouped(permissionsRes.data.grouped)
        setRoles(rolesRes.data)
        setUsers(usersRes.data)

        const firstRole = rolesRes.data[0]
        if (firstRole) {
          setSelectedRoleId(firstRole.id)
          const roleRes = await fetchRolePermissionsApi(firstRole.id)
          setRolePermissionIds(flattenPermissionIds(roleRes.data.grouped))
        }
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Failed to load permissions.')
      } finally {
        setLoading(false)
      }
    }

    void loadInitial()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetchUsersApi(userSearch)
        setUsers(response.data)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Failed to search users.')
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [userSearch])

  useEffect(() => {
    if (!selectedRoleId) {
      return
    }

    const loadRole = async () => {
      try {
        const response = await fetchRolePermissionsApi(selectedRoleId)
        setRolePermissionIds(flattenPermissionIds(response.data.grouped))
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Failed to load role permissions.')
      }
    }

    void loadRole()
  }, [selectedRoleId])

  useEffect(() => {
    if (!selectedUserId) {
      setUserSnapshot(null)
      setUserOverrides({})
      return
    }

    const loadUser = async () => {
      try {
        const response = await fetchUserPermissionsApi(selectedUserId)
        setUserSnapshot(response.data)
        const overrides = response.data.direct_permissions.reduce<Record<string, 'allow' | 'deny' | ''>>((acc, item) => {
          overrides[item.id] = item.effect
          return acc
        }, {})

        setUserOverrides(overrides)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Failed to load user permissions.')
      }
    }

    void loadUser()
  }, [selectedUserId])

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? null,
    [roles, selectedRoleId],
  )

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [selectedUserId, users],
  )

  const toggleRolePermission = (permissionId: string) => {
    setRolePermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((value) => value !== permissionId)
        : [...current, permissionId],
    )
  }

  const handleSaveRolePermissions = async () => {
    if (!selectedRoleId) {
      return
    }

    setSavingRole(true)
    setError(null)
    try {
      const response = await syncRolePermissionsApi(selectedRoleId, rolePermissionIds)
      setRolePermissionIds(flattenPermissionIds(response.data.grouped))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to save role permissions.')
    } finally {
      setSavingRole(false)
    }
  }

  const handleUserOverrideChange = (permissionId: string, effect: 'allow' | 'deny' | '') => {
    setUserOverrides((current) => ({ ...current, [permissionId]: effect }))
  }

  const handleSaveUserOverrides = async () => {
    if (!selectedUserId) {
      return
    }

    setSavingUser(true)
    setError(null)
    try {
      const overrides = Object.entries(userOverrides)
        .filter(([, effect]) => effect === 'allow' || effect === 'deny')
        .map(([permission_id, effect]) => ({ permission_id, effect: effect as 'allow' | 'deny' }))

      const response = await syncUserPermissionsApi(selectedUserId, overrides)
      setUserSnapshot(response.data)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to save user overrides.')
    } finally {
      setSavingUser(false)
    }
  }

  if (!hasPermission('permission.view')) {
    return <div className="alert alert-danger">You do not have permission to view this page.</div>
  }

  return (
    <div className="container-fluid px-0">
      <div className="card mb-6">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-4">
            <div>
              <h2 className="mb-1">Permissions</h2>
              <div className="text-muted">Manage role permissions and user overrides.</div>
            </div>
            <div className="badge badge-light-primary align-self-start">Backend source of truth</div>
          </div>
          {error ? <div className="alert alert-danger mt-4 mb-0">{error}</div> : null}
          {loading ? <div className="text-muted mt-4">Loading permissions...</div> : null}
        </div>
      </div>

      <div className="row g-5">
        <div className="col-12 col-xl-6">
          <div className="card h-100">
            <div className="card-header">
              <div>
                <h3 className="card-title mb-1">Role Permissions</h3>
                <div className="text-muted fs-7">Select a role and sync its access.</div>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-5">
                <label className="form-label fw-semibold">Role</label>
                <select
                  className="form-select form-select-solid"
                  value={selectedRoleId}
                  onChange={(event) => setSelectedRoleId(event.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} {role.is_system ? '(system)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRole ? (
                <div className="mb-4 text-muted fs-7">
                  {selectedRole.permissions_count} permissions assigned to {selectedRole.name}
                </div>
              ) : null}

              <div className="d-flex flex-column gap-6">
                {grouped.map((group) => (
                  <div key={group.module} className="border rounded p-4">
                    <div className="fw-bold text-uppercase text-muted fs-8 mb-3">{group.module}</div>
                    <div className="d-flex flex-column gap-3">
                      {group.permissions.map((permission) => (
                        <label key={permission.id} className="form-check form-check-custom form-check-solid d-flex gap-3">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={rolePermissionIds.includes(permission.id)}
                            onChange={() => toggleRolePermission(permission.id)}
                          />
                          <span className="form-check-label">
                            <span className="fw-semibold d-block">{permission.display_name ?? permission.name}</span>
                            <span className="text-muted fs-7">{permission.name}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-end mt-5">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={savingRole || !selectedRoleId}
                  onClick={handleSaveRolePermissions}
                >
                  {savingRole ? 'Saving...' : 'Save Role Permissions'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="card h-100">
            <div className="card-header">
              <div>
                <h3 className="card-title mb-1">User Overrides</h3>
                <div className="text-muted fs-7">Add explicit allow or deny overrides per user.</div>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <label className="form-label fw-semibold">Search user</label>
                <input
                  className="form-control form-control-solid"
                  placeholder="Search by name or email"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                />
              </div>

              <div className="mb-5">
                <label className="form-label fw-semibold">Select user</label>
                <select
                  className="form-select form-select-solid"
                  value={selectedUserId}
                  onChange={(event) => setSelectedUserId(event.target.value)}
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              {selectedUser ? (
                <div className="mb-4 text-muted fs-7">
                  Effective permissions preview for {selectedUser.name}
                </div>
              ) : null}

              <div className="d-flex flex-column gap-4" style={{ maxHeight: 520, overflow: 'auto' }}>
                {permissions.map((permission) => (
                  <div key={permission.id} className="border rounded p-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                      <div>
                        <div className="fw-semibold">{permission.display_name ?? permission.name}</div>
                        <div className="text-muted fs-7">
                          {permission.module}.{permission.action}
                        </div>
                      </div>
                      <select
                        className="form-select form-select-solid w-auto"
                        value={userOverrides[permission.id] ?? ''}
                        onChange={(event) =>
                          handleUserOverrideChange(permission.id, event.target.value as 'allow' | 'deny' | '')
                        }
                      >
                        <option value="">Inherit</option>
                        <option value="allow">Allow</option>
                        <option value="deny">Deny</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <div className="fw-semibold mb-2">Effective permissions</div>
                <div className="d-flex flex-wrap gap-2">
                  {(userSnapshot?.effective_permission_names ?? []).map((permission) => (
                    <span key={permission} className="badge badge-light-success">
                      {permission}
                    </span>
                  ))}
                  {!userSnapshot?.effective_permission_names?.length ? (
                    <span className="text-muted">No permissions loaded yet.</span>
                  ) : null}
                </div>
              </div>

              <div className="d-flex justify-content-end mt-5">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={savingUser || !selectedUserId}
                  onClick={handleSaveUserOverrides}
                >
                  {savingUser ? 'Saving...' : 'Save User Overrides'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PermissionsPage = () => (
  <PermissionGuard anyOf={['permission.view', 'permission.manage']}>
    <PermissionsPageContent />
  </PermissionGuard>
)

export default PermissionsPage
