export interface AuthSession {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  }
}

const sessionEndpoint = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/user/me`
  : null

export async function getSessionFromCookieHeader(
  cookieHeader?: string | null
): Promise<AuthSession | null> {
  if (!sessionEndpoint || !cookieHeader) {
    return null
  }

  try {
    const response = await fetch(sessionEndpoint, {
      method: 'GET',
      headers: {
        cookie: cookieHeader,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const session = (await response.json()) as AuthSession | null

    if (!session?.user) {
      return null
    }

    return session
  } catch {
    return null
  }
}