import { pocketbaseConfig } from '@/config'
import PocketBase from 'pocketbase'

export const pb = new PocketBase(pocketbaseConfig.baseUrl)
