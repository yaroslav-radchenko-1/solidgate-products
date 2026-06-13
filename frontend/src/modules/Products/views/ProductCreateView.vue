<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductCreation } from '../composables/useProductCreation'
import { useProductStore } from '../stores/productStore'
import type { PriceMode, PriceRow, SettingsUpdate } from '../types/product.types'
import SettingsPanel from '../components/SettingsPanel.vue'
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

const areKeysConfigured = computed(
  () => Boolean(store.settings.publicKey) && store.settings.hasSecretKey,
)

const handleSaveSettings = async (update: SettingsUpdate) => {
  await store.saveSettings(update)
}

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
  } catch {
    // settings or rates may not be available yet
  }
})
</script>

<template>
  <main class="product-create">
    <h1 class="product-create__heading">Create Solidgate Product</h1>

    <SettingsPanel :settings="store.settings" @save="handleSaveSettings" />

    <p v-if="!areKeysConfigured" class="product-create__keys-warning">
      ⚠️ Solidgate API keys are not set. Open <strong>API Settings</strong> above and enter your
      public and secret keys before creating a product.
    </p>

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
      :disabled="isSubmitting || !formData.description || !areKeysConfigured"
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

  &__keys-warning {
    margin: 0 0 1.5rem;
    padding: 0.75rem 1rem;
    background: #fff8e1;
    border: 0.0625rem solid #f0c36d;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #7a5b00;
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
