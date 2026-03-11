import type { AppServer } from '@/index'
import { treaty } from '@elysiajs/eden'

const URL = process.env.BUN_PUBLIC_BASE_URL
if (!URL) {
    throw new Error('BUN_PUBLIC_BASE_URL is not defined')
}

const apiFetch = treaty<AppServer>(URL)

export default apiFetch
