
export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(`${import.meta.env.VITE_APP_BASE_URL}${endpoint}`)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }
    return response.json()
  },
}
