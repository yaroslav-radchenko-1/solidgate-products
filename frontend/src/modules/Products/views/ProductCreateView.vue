<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductCreation } from '../composables/useProductCreation'
import { useProductStore } from '../stores/productStore'
import type { PriceMode, PriceRow } from '../types/product.types'
import TemplateManager from '../components/TemplateManager.vue'
import ProductForm from '../components/ProductForm.vue'
import PricingSpreadsheet from '../components/PricingSpreadsheet.vue'
import SubmissionProgress from '../components/SubmissionProgress.vue'

const store = useProductStore()

const {
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
  submitProduct,
  recalculateRow,
  addRowAbove,
  addRowBelow,
  removeRow,
  saveAsTemplate,
  loadTemplate,
} = useProductCreation()

const DEFAULT_PUBLIC_KEY = 'api_pk_0bf6ecca_a325_4526_8631_4b577a90a9df'
const DEFAULT_SECRET_KEY = 'api_sk_618581bc_9f29_467a_93f6_876662a97ba8'

const handleSetCurrency = (index: number, currency: string) => {
  const row = priceRows[index]
  if (!row) return
  row.currency = currency
  if (row.mode === 'convert') {
    recalculateRow(row)
  }
}

const handleSetMode = (index: number, mode: PriceMode) => {
  const row = priceRows[index]
  if (!row) return
  row.mode = mode
  if (mode === 'convert') {
    recalculateRow(row)
  }
}

const handleSetCountryBoth = (index: number, name: string, code: string) => {
  const row = priceRows[index]
  if (!row) return
  row.countryName = name
  row.country = code
}

const handleAddRowAtEnd = () => {
  addRowBelow(priceRows.length - 1)
}

const handleTemplateLoad = async (id: string) => {
  await loadTemplate(id)
}

const handleSubmit = () => {
  submitProduct()
}

onMounted(async () => {
  try {
    await Promise.all([store.fetchExchangeRates(), store.fetchSettings()])
    if (!store.settings.publicKey || !store.settings.secretKey) {
      await store.saveSettings({
        publicKey: DEFAULT_PUBLIC_KEY,
        secretKey: DEFAULT_SECRET_KEY,
      })
    }
  } catch {
    // settings or rates may not be available yet
  }
})
</script>

<template>
  <main class="product-create">
    <h1 class="product-create__heading">Create Solidgate Product</h1>

    <TemplateManager :on-save="saveAsTemplate" @load="handleTemplateLoad" />

    <ProductForm v-model:form-data="formData" :generated-name="generatedName" />

    <PricingSpreadsheet
      :rows="priceRows"
      :is-drag-filling="isDragFilling"
      :drag-fill-range="dragFillRange"
      :has-trial="formData.type === 'recurring' && formData.trial"
      @set-price="
        (index: number, field: keyof PriceRow, value: number | null) =>
          setRowPrice(index, field, value)
      "
      @set-currency="handleSetCurrency"
      @set-mode="handleSetMode"
      @set-country-both="handleSetCountryBoth"
      @start-drag-fill="
        (index: number, column: string, shiftKey: boolean) => startDragFill(index, column, shiftKey)
      "
      @update-drag-fill="updateDragFill"
      @end-drag-fill="endDragFill"
      @add-row-above="addRowAbove"
      @add-row-below="addRowBelow"
      @remove-row="removeRow"
      @add-row-at-end="handleAddRowAtEnd"
    />

    <SubmissionProgress
      v-if="isSubmitting || steps.length > 0 || errors.length > 0"
      :progress="progress"
      :steps="steps"
      :errors="errors"
      :is-submitting="isSubmitting"
    />

    <button
      class="product-create__submit"
      type="button"
      :disabled="isSubmitting || !formData.description"
      @click="handleSubmit"
    >
      {{ isSubmitting ? 'Submitting...' : 'Create Product' }}
    </button>
  </main>
</template>

<style scoped lang="scss">
.product-create {
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;

  &__heading {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1.5rem;
    color: var(--color-heading);
  }

  &__submit {
    padding: 0.625rem 1.5rem;
    background: #5ca701;
    color: #fff;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;

    &:hover:not(:disabled) {
      background: #4e8f01;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
