import { api } from '@/shared/services/api'
import type {
  ExchangeRates,
  ProductFormData,
  Settings,
  SettingsUpdate,
  TemplateListItem,
  TemplateFull,
} from '../types/product.types'

type CreateProductResponse = {
  id: string
}

type CreatePricePayload = {
  isDefault: boolean
  country: string
  currency: string
  productPrice: number
  trialPrice?: number
}

type BillingPeriod = { unit: 'day' | 'week' | 'month' | 'year'; value: number }

const parseBillingPeriod = (input: string): BillingPeriod => {
  const match = /(\d+)\s*(day|week|month|year)s?/i.exec(input.trim())
  if (!match) {
    throw new Error(
      `Invalid billing period "${input}". Use format like "7 days", "4 weeks", "1 month", "1 year".`,
    )
  }
  let value = Number(match[1])
  let unit = match[2]!.toLowerCase() as BillingPeriod['unit']
  if (unit === 'day' && value > 24 && value % 7 === 0) {
    unit = 'week'
    value = value / 7
  }
  if (value > 24) {
    throw new Error(
      `Billing period value ${value} is too large. Solidgate allows max 24 per unit — use a larger unit (e.g. "1 month" instead of "30 days").`,
    )
  }
  return { unit, value }
}

export const createProduct = (data: ProductFormData): Promise<CreateProductResponse> => {
  const payload: Record<string, unknown> = {
    name: data.name,
    type: data.type,
    description: data.description,
    status: data.status,
    payment_action: 'auth_settle',
    settle_interval: 120,
  }

  if (data.type === 'recurring') {
    if (!data.billingPeriod) throw new Error('Billing period is required for recurring products.')
    payload.billing_period = parseBillingPeriod(data.billingPeriod)
    if (data.retryMode) payload.retry_mode = data.retryMode
    if (data.retryStrategyId) {
      const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (uuidRe.test(data.retryStrategyId.trim())) {
        payload.retry_strategy_id = data.retryStrategyId.trim()
      } else {
        throw new Error(
          `Retry Strategy ID must be a UUID (e.g. "550e8400-e29b-41d4-a716-446655440000"), got "${data.retryStrategyId}". Leave the field empty or paste the UUID from your Solidgate dashboard.`,
        )
      }
    }
    if (data.trial && data.trialBillingPeriod) {
      payload.trial = {
        billing_period: parseBillingPeriod(data.trialBillingPeriod),
        payment_action: 'auth_settle',
        settle_interval: 120,
      }
    }
  }

  return api.post('/solidgate/products', payload).then((res) => res.data as CreateProductResponse)
}

export const createProductPrice = (
  productId: string,
  data: CreatePricePayload,
): Promise<unknown> => {
  const toCents = (amount: number): number => Math.round(amount * 100)

  const payload: Record<string, unknown> = {
    default: data.isDefault,
    status: 'active',
    product_price: toCents(data.productPrice),
    currency: data.currency,
  }

  if (!data.isDefault) {
    payload.country = data.country
  }

  if (data.trialPrice !== undefined && data.trialPrice !== null) {
    payload.trial_price = toCents(data.trialPrice)
  }

  return api.post(`/solidgate/products/${productId}/prices`, payload).then((res) => res.data)
}

export const fetchExchangeRates = (): Promise<ExchangeRates> =>
  api.get('/exchange-rates').then((res) => (res.data as { rates: ExchangeRates }).rates)

export const fetchSettings = (): Promise<Settings> =>
  api.get('/settings').then((res) => res.data as Settings)

export const saveSettings = (update: SettingsUpdate): Promise<Settings> =>
  api.put('/settings', update).then((res) => res.data as Settings)

export const fetchTemplates = (): Promise<TemplateListItem[]> =>
  api.get('/templates').then((res) => res.data as TemplateListItem[])

export const fetchTemplate = (id: string): Promise<TemplateFull> =>
  api.get(`/templates/${id}`).then((res) => {
    const raw = res.data as { id: string; name: string; data: string; updatedAt: string }
    return { ...raw, data: JSON.parse(raw.data) } as TemplateFull
  })

export const saveTemplate = (name: string, data: string): Promise<{ id: string; name: string }> =>
  api.post('/templates', { name, data }).then((res) => res.data as { id: string; name: string })

export const updateTemplate = (
  id: string,
  name: string,
  data: string,
): Promise<{ id: string; name: string }> =>
  api
    .put(`/templates/${id}`, { name, data })
    .then((res) => res.data as { id: string; name: string })

export const deleteTemplate = (id: string): Promise<void> =>
  api.delete(`/templates/${id}`).then(() => undefined)
