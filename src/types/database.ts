export interface Url {
  id: string,
  short_code: string,
  original_url: string,
  created_at: string,
  clicks: number,
  created_by: string | null,
  is_active: boolean
}

export interface CreateUrlDto {
  original_url: string,
  short_code?: string
}

export interface UpdateUrlDto {
  original_url?: string,
  is_active?: boolean
}