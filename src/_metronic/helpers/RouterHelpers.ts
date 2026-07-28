export function getCurrentUrl(pathname: string) {
  return pathname.split(/[?#]/)[0]
}

export function checkIsActive(pathname: string, url: string, exact: boolean = false, excludePaths: string[] = []) {
  const current = getCurrentUrl(pathname)
  if (!current || !url) {
    return false
  }

  if (current === url) {
    return true
  }

  if (exact) {
    return false
  }

  if (current.startsWith(url + '/')) {
    if (excludePaths.some((excludePath) => current.startsWith(excludePath))) {
      return false
    }
    return true
  }

  return false
}
