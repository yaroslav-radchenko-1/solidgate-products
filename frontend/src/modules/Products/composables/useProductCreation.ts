import { computed, reactive, ref, type ComputedRef, type Ref } from 'vue'
import type {
  PriceRow,
  ProductFormData,
  SubmissionStep,
  TemplateListItem,
} from '../types/product.types'
import { COUNTRY_GROUPS } from '../consts/countries.consts'
import { useProductStore } from '../stores/productStore'
import * as productApi from '../services/productApi'
import { usePriceConversion } from './usePriceConversion'

type UseProductCreationReturns = {
  formData: ProductFormData
  priceRows: PriceRow[]
  generatedName: ComputedRef<string>
  isSubmitting: Ref<boolean>
  progress: Ref<number>
  steps: SubmissionStep[]
  errors: Ref<string[]>
  setRowPrice: (index: number, field: keyof PriceRow, value: number | null) => void
  startDragFill: (rowIndex: number, column: string, shiftKey: boolean) => void
  updateDragFill: (rowIndex: number) => void
  endDragFill: () => void
  isDragFilling: Ref<boolean>
  dragFillRange: Ref<{ start: number; end: number } | null>
  selectedDragColumns: Ref<Set<string>>
  submitProduct: () => Promise<void>
  recalculateRow: (row: PriceRow) => void
  addRowAbove: (index: number) => void
  addRowBelow: (index: number) => void
  removeRow: (index: number) => void
  templateList: Ref<TemplateListItem[]>
  fetchTemplateList: () => Promise<void>
  saveAsTemplate: (name: string) => Promise<void>
  loadTemplate: (id: string) => Promise<void>
}

const createBlankRow = (groupKey: string): PriceRow => ({
  country: '',
  countryName: '',
  currency: 'USD',
  mode: 'convert',
  usdPrice: null,
  localPrice: null,
  trialUsdPrice: null,
  trialLocalPrice: null,
  isDefault: false,
  groupKey,
})

const buildInitialRows = (): PriceRow[] => {
  const defaultRow: PriceRow = {
    country: 'DEFAULT',
    countryName: 'Default',
    currency: 'USD',
    mode: 'convert',
    usdPrice: null,
    localPrice: null,
    trialUsdPrice: null,
    trialLocalPrice: null,
    isDefault: true,
    groupKey: 'default',
  }

  const countryRows: PriceRow[] = COUNTRY_GROUPS.flatMap((group) =>
    group.countries.map((c) => ({
      country: c.code,
      countryName: c.name,
      currency: c.defaultCurrency,
      mode: 'convert' as const,
      usdPrice: null,
      localPrice: null,
      trialUsdPrice: null,
      trialLocalPrice: null,
      isDefault: false,
      groupKey: group.label,
    })),
  )

  return [defaultRow, ...countryRows]
}

export const useProductCreation = (): UseProductCreationReturns => {
  const store = useProductStore()

  const formData = reactive<ProductFormData>({
    name: '',
    type: 'one-time',
    description: '',
    status: 'active',
    billingPeriod: '28 days',
    trial: false,
    trialBillingPeriod: '',
    retryMode: 'static',
    retryStrategyId: 'f5d39994-10b6-4cb5-8a09-38d7a5109e8a',
  })

  const priceRows = reactive<PriceRow[]>(buildInitialRows())
  const isSubmitting = ref(false)
  const progress = ref(0)
  const steps = reactive<SubmissionStep[]>([])
  const errors = ref<string[]>([])

  const isDragFilling = ref(false)
  const dragFillSource = ref<number | null>(null)
  const dragFillRange = ref<{ start: number; end: number } | null>(null)

  const { recalculateRow } = usePriceConversion(() => priceRows)

  const setRowPrice = (index: number, field: keyof PriceRow, value: number | null) => {
    const row = priceRows[index]
    if (!row) return

    if (
      field === 'usdPrice' ||
      field === 'localPrice' ||
      field === 'trialUsdPrice' ||
      field === 'trialLocalPrice'
    ) {
      ;(row[field] as number | null) = value
    }

    if (row.mode === 'convert') {
      recalculateRow(row)
    }
  }

  const addRowAbove = (index: number) => {
    const neighbor = priceRows[index]
    const groupKey = neighbor?.groupKey ?? 'custom'
    priceRows.splice(index, 0, createBlankRow(groupKey))
  }

  const addRowBelow = (index: number) => {
    const neighbor = priceRows[index]
    const groupKey = neighbor?.groupKey ?? 'custom'
    priceRows.splice(index + 1, 0, createBlankRow(groupKey))
  }

  const removeRow = (index: number) => {
    const row = priceRows[index]
    if (!row || row.isDefault) return
    priceRows.splice(index, 1)
  }

  const selectedDragColumns = ref<Set<string>>(new Set())

  const startDragFill = (rowIndex: number, column: string, shiftKey: boolean) => {
    if (shiftKey) {
      selectedDragColumns.value = new Set([...selectedDragColumns.value, column])
    } else {
      selectedDragColumns.value = new Set([column])
    }
    isDragFilling.value = true
    dragFillSource.value = rowIndex
    dragFillRange.value = { start: rowIndex, end: rowIndex }
  }

  const updateDragFill = (rowIndex: number) => {
    if (!isDragFilling.value || dragFillSource.value === null) return
    dragFillRange.value = {
      start: Math.min(dragFillSource.value, rowIndex),
      end: Math.max(dragFillSource.value, rowIndex),
    }
  }

  const endDragFill = () => {
    if (!isDragFilling.value || dragFillSource.value === null || !dragFillRange.value) {
      isDragFilling.value = false
      dragFillSource.value = null
      dragFillRange.value = null
      return
    }

    const source = priceRows[dragFillSource.value]
    if (!source) return

    const { start, end } = dragFillRange.value
    for (let i = start; i <= end; i++) {
      if (i === dragFillSource.value) continue
      const target = priceRows[i]
      if (!target || target.isDefault) continue

      const cols = selectedDragColumns.value
      if (cols.has('currency')) target.currency = source.currency
      if (cols.has('mode')) target.mode = source.mode
      if (cols.has('usdPrice')) target.usdPrice = source.usdPrice
      if (cols.has('localPrice')) target.localPrice = source.localPrice
      if (cols.has('trialUsdPrice')) target.trialUsdPrice = source.trialUsdPrice
      if (cols.has('trialLocalPrice')) target.trialLocalPrice = source.trialLocalPrice
      if (target.mode === 'convert') {
        recalculateRow(target)
      }
    }

    isDragFilling.value = false
    dragFillSource.value = null
    dragFillRange.value = null
  }

  const submitProduct = async () => {
    errors.value = []

    const validationErrors: string[] = []
    for (const row of priceRows) {
      if (!row.country.trim()) continue
      const label = row.countryName || row.country
      if (!row.currency.trim()) validationErrors.push(`${label}: currency is missing`)
      const hasPrice = row.isDefault
        ? (row.usdPrice ?? 0) > 0
        : row.mode === 'local'
          ? (row.localPrice ?? 0) > 0
          : (row.usdPrice ?? 0) > 0 || (row.localPrice ?? 0) > 0
      if (!hasPrice) validationErrors.push(`${label}: price is missing`)
      if (formData.trial) {
        const hasTrial = row.isDefault
          ? (row.trialUsdPrice ?? 0) > 0
          : row.mode === 'local'
            ? (row.trialLocalPrice ?? 0) > 0
            : (row.trialUsdPrice ?? 0) > 0 || (row.trialLocalPrice ?? 0) > 0
        if (!hasTrial) validationErrors.push(`${label}: trial price is missing`)
      }
    }
    if (validationErrors.length) {
      errors.value = validationErrors
      return
    }

    isSubmitting.value = true
    progress.value = 0
    steps.length = 0

    const rowsToSubmit = priceRows.filter((r) => r.country.trim() !== '')
    const totalSteps = 1 + rowsToSubmit.length

    steps.push({ label: `Creating product "${formData.name}"`, status: 'pending' })

    try {
      await store.fetchExchangeRates()
    } catch {
      // rates may already be loaded
    }

    let productId: string

    const productStep = steps[0]
    if (!productStep) return

    try {
      const result = await productApi.createProduct({ ...formData })
      productId = result.id
      productStep.status = 'success'
      progress.value = 1 / totalSteps
    } catch (err) {
      productStep.status = 'error'
      productStep.error = err instanceof Error ? err.message : 'Failed to create product'
      errors.value.push(productStep.error)
      isSubmitting.value = false
      return
    }

    for (let i = 0; i < rowsToSubmit.length; i++) {
      const row = rowsToSubmit[i]
      if (!row) continue

      const stepIndex = steps.length
      steps.push({
        label: `Creating price for ${row.countryName || row.country} (${row.currency})`,
        status: 'pending',
      })

      const currentStep = steps[stepIndex]
      if (!currentStep) continue

      try {
        const finalPrice = row.isDefault
          ? (row.usdPrice ?? 0)
          : row.mode === 'local'
            ? (row.localPrice ?? 0)
            : (row.localPrice ?? row.usdPrice ?? 0)
        const finalTrialPrice = row.isDefault
          ? (row.trialUsdPrice ?? undefined)
          : row.mode === 'local'
            ? (row.trialLocalPrice ?? undefined)
            : (row.trialLocalPrice ?? row.trialUsdPrice ?? undefined)

        await productApi.createProductPrice(productId, {
          isDefault: row.isDefault,
          country: row.country,
          currency: row.isDefault ? 'USD' : row.currency,
          productPrice: finalPrice,
          trialPrice: finalTrialPrice,
        })
        currentStep.status = 'success'
      } catch (err: unknown) {
        currentStep.status = 'error'
        const axiosErr = err as { response?: { data?: unknown }; message?: string }
        const serverBody = axiosErr.response?.data
        let detail = ''
        if (serverBody && typeof serverBody === 'object') {
          const body = serverBody as { error?: { messages?: string[] }; message?: string }
          detail = body.error?.messages?.join('; ') || body.message || JSON.stringify(serverBody)
        }
        currentStep.error =
          detail || axiosErr.message || `Failed to create price for ${row.countryName}`
        errors.value.push(currentStep.error ?? '')
      }

      progress.value = (i + 2) / totalSteps
    }

    isSubmitting.value = false
  }

  const periodNumber = (period: string) => period.replace(/\D+/g, '').trim() || period

  const generatedName = computed(() => {
    const desc = formData.description || ''
    const defaultRow = priceRows[0]
    const price = defaultRow?.usdPrice ?? ''

    // One-time: no period or trial, so the trial/period slots are zero-filled.
    if (formData.type === 'one-time') {
      return `${price}_0_0_0_${desc}`
    }

    const period = periodNumber(formData.billingPeriod || '')
    if (formData.trial) {
      const trialPrice = defaultRow?.trialUsdPrice ?? ''
      const trialPeriod = periodNumber(formData.trialBillingPeriod || '')
      return `${trialPrice}_${price}_${trialPeriod}_${period}_${desc}`
    }

    // No trial: duplicate the default price/period into the trial slots.
    return `${price}_${price}_${period}_${period}_${desc}`
  })

  const templateList = ref<TemplateListItem[]>([])

  const fetchTemplateList = async () => {
    try {
      templateList.value = await productApi.fetchTemplates()
    } catch {
      // templates may not be available
    }
  }

  const saveAsTemplate = async (name: string) => {
    const data = JSON.stringify({ formData: { ...formData }, priceRows: [...priceRows] })
    await productApi.saveTemplate(name, data)
  }

  const loadTemplate = async (id: string) => {
    const template = await productApi.fetchTemplate(id)
    const { formData: savedForm, priceRows: savedRows } = template.data

    Object.assign(formData, savedForm)
    priceRows.splice(0, priceRows.length, ...savedRows)
  }

  return {
    formData,
    priceRows,
    generatedName,
    isSubmitting,
    progress,
    steps,
    errors,
    setRowPrice,
    startDragFill,
    updateDragFill,
    endDragFill,
    isDragFilling,
    dragFillRange,
    selectedDragColumns,
    submitProduct,
    recalculateRow,
    addRowAbove,
    addRowBelow,
    removeRow,
    templateList,
    fetchTemplateList,
    saveAsTemplate,
    loadTemplate,
  }
}
