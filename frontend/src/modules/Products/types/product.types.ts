export type AvailableCountry = {
  name: string
  code: string
}

export type ProductType = 'recurring' | 'one-time'

export type PriceMode = 'local' | 'convert'

export type CountryGroup = {
  label: string
  emoji: string
  countries: CountryEntry[]
}

export type CountryEntry = {
  name: string
  code: string
  defaultCurrency: string
}

export type PriceRow = {
  country: string
  countryName: string
  currency: string
  mode: PriceMode
  usdPrice: number | null
  localPrice: number | null
  trialUsdPrice: number | null
  trialLocalPrice: number | null
  isDefault: boolean
  groupKey: string
}

export type ProductFormData = {
  name: string
  type: ProductType
  description: string
  status: 'active'
  billingPeriod: string
  trial: boolean
  trialBillingPeriod: string
  retryMode: string
  retryStrategyId: string
}

export type ExchangeRates = Record<string, number>

export type Settings = {
  publicKey: string
  secretKey: string
}

export type SubmissionStep = {
  label: string
  status: 'pending' | 'success' | 'error'
  error?: string
}

export type TemplateListItem = {
  id: string
  name: string
  updatedAt: string
}

export type TemplateFull = {
  id: string
  name: string
  data: TemplateData
  updatedAt: string
}

export type TemplateData = {
  formData: ProductFormData
  priceRows: PriceRow[]
}
