import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ExchangeRates, Settings, SettingsUpdate } from '../types/product.types'
import * as productApi from '../services/productApi'

export const useProductStore = defineStore('product', () => {
  const exchangeRates = ref<ExchangeRates>({})
  const settings = ref<Settings>({ publicKey: '', hasSecretKey: false })

  const fetchExchangeRates = async () => {
    const data = await productApi.fetchExchangeRates()
    exchangeRates.value = data
  }

  const convertUsdToLocal = (usdAmount: number, currency: string): number => {
    if (currency === 'USD') return usdAmount

    const rate = exchangeRates.value[currency]
    if (!rate) return usdAmount

    return Math.round(usdAmount * rate * 100) / 100
  }

  const fetchSettings = async () => {
    settings.value = await productApi.fetchSettings()
  }

  const saveSettings = async (update: SettingsUpdate) => {
    settings.value = await productApi.saveSettings(update)
  }

  return {
    exchangeRates,
    settings,
    fetchExchangeRates,
    convertUsdToLocal,
    fetchSettings,
    saveSettings,
  }
})
