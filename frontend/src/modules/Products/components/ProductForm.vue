<script setup lang="ts">
import { watch } from 'vue'
import type { ProductFormData } from '../types/product.types'

const props = defineProps<{
  generatedName: string
}>()

const formData = defineModel<ProductFormData>('formData', { required: true })

watch(
  () => props.generatedName,
  (name) => {
    formData.value.name = name
  },
)

watch(
  () => formData.value.type,
  (type) => {
    if (type === 'one-time') {
      formData.value.trial = false
    }
  },
)
</script>

<template>
  <div class="product-form">
    <h2 class="product-form__title">Product Details</h2>
    <div class="product-form__grid">
      <div class="product-form__field">
        <label class="product-form__label">Description</label>
        <input
          v-model="formData.description"
          type="text"
          class="product-form__input"
          placeholder="e.g. negative_thinking"
        />
      </div>

      <div class="product-form__field">
        <label class="product-form__label">Name (auto-generated)</label>
        <input
          :value="generatedName"
          type="text"
          class="product-form__input product-form__input--readonly"
          readonly
        />
      </div>

      <div class="product-form__field">
        <label class="product-form__label">Type</label>
        <select v-model="formData.type" class="product-form__select">
          <option value="one-time">One-time</option>
          <option value="recurring">Recurring</option>
        </select>
      </div>

      <div v-if="formData.type === 'recurring'" class="product-form__field">
        <label class="product-form__label">Billing Period</label>
        <input
          v-model="formData.billingPeriod"
          type="text"
          class="product-form__input"
          placeholder="e.g. 28 days"
        />
      </div>

      <div v-if="formData.type === 'recurring'" class="product-form__field">
        <label class="product-form__label">Trial</label>
        <label class="product-form__checkbox-label">
          <input v-model="formData.trial" type="checkbox" />
          Enable trial period
        </label>
      </div>

      <div v-if="formData.type === 'recurring' && formData.trial" class="product-form__field">
        <label class="product-form__label">Trial Billing Period</label>
        <input
          v-model="formData.trialBillingPeriod"
          type="text"
          class="product-form__input"
          placeholder="e.g. 7 days"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-form {
  background: var(--color-background);
  border: 0.0625rem solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;

  &__title {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 1rem;
    color: var(--color-heading);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    &--full {
      grid-column: 1 / -1;
    }
  }

  &__label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text);
  }

  &__input,
  &__select {
    padding: 0.5rem 0.75rem;
    border: 0.0625rem solid var(--color-border);
    border-radius: 0.25rem;
    font-size: 0.875rem;
    outline: none;
    background: var(--color-background);
    color: var(--color-text);

    &:focus {
      border-color: var(--color-border-hover);
    }

    &--readonly {
      background: var(--color-background-mute, #f5f5f5);
      cursor: default;
      color: var(--color-text-light, #666);
    }
  }

  &__checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
  }
}
</style>
