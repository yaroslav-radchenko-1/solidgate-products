<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { TemplateListItem } from '../types/product.types'
import * as productApi from '../services/productApi'

const props = defineProps<{
  onSave: (name: string) => Promise<void>
}>()

const emit = defineEmits<{
  load: [id: string]
}>()

const templates = ref<TemplateListItem[]>([])
const selectedId = ref('')
const saveName = ref('')
const isLoading = ref(false)
const isSaving = ref(false)
const showSaveInput = ref(false)

const fetchList = async () => {
  try {
    templates.value = await productApi.fetchTemplates()
  } catch {
    // templates may not be available
  }
}

watch(selectedId, (id) => {
  if (id) {
    emit('load', id)
  }
})

const handleSave = async () => {
  if (!saveName.value.trim()) return
  isSaving.value = true
  try {
    await props.onSave(saveName.value.trim())
    await fetchList()
  } finally {
    saveName.value = ''
    showSaveInput.value = false
    isSaving.value = false
  }
}

const handleCancelSave = () => {
  showSaveInput.value = false
  saveName.value = ''
}

const handleDelete = async (id: string) => {
  isLoading.value = true
  try {
    await productApi.deleteTemplate(id)
    if (selectedId.value === id) {
      selectedId.value = ''
    }
    await fetchList()
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchList)

defineExpose({ fetchList })
</script>

<template>
  <div class="template-manager">
    <h3 class="template-manager__title">Templates</h3>
    <div class="template-manager__row">
      <select v-model="selectedId" class="template-manager__select">
        <option value="">-- Select template --</option>
        <option v-for="t in templates" :key="t.id" :value="t.id">
          {{ t.name }}
        </option>
      </select>

      <button
        v-if="selectedId"
        type="button"
        class="template-manager__btn template-manager__btn--delete"
        :disabled="isLoading"
        @click="handleDelete(selectedId)"
      >
        Delete
      </button>

      <button
        v-if="!showSaveInput"
        type="button"
        class="template-manager__btn template-manager__btn--save"
        @click="showSaveInput = true"
      >
        Save as Template
      </button>

      <template v-if="showSaveInput">
        <input
          v-model="saveName"
          type="text"
          class="template-manager__input"
          placeholder="Template name"
          @keyup.enter="handleSave"
        />
        <button
          type="button"
          class="template-manager__btn template-manager__btn--confirm"
          :disabled="!saveName.trim() || isSaving"
          @click="handleSave"
        >
          Save
        </button>
        <button
          type="button"
          class="template-manager__btn template-manager__btn--cancel"
          @click="handleCancelSave"
        >
          Cancel
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.template-manager {
  background: var(--color-background);
  border: 0.0625rem solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;

  &__title {
    font-size: 0.875rem;
    font-weight: 700;
    margin: 0 0 0.625rem;
    color: var(--color-heading);
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__select {
    padding: 0.375rem 0.625rem;
    border: 0.0625rem solid var(--color-border);
    border-radius: 0.25rem;
    font-size: 0.8125rem;
    background: var(--color-background);
    color: var(--color-text);
    min-width: 12rem;
  }

  &__input {
    padding: 0.375rem 0.625rem;
    border: 0.0625rem solid var(--color-border);
    border-radius: 0.25rem;
    font-size: 0.8125rem;
    background: var(--color-background);
    color: var(--color-text);
    min-width: 10rem;
  }

  &__btn {
    padding: 0.375rem 0.75rem;
    border: 0.0625rem solid var(--color-border);
    border-radius: 0.25rem;
    font-size: 0.8125rem;
    cursor: pointer;
    background: var(--color-background);
    color: var(--color-text);

    &:hover:not(:disabled) {
      border-color: var(--color-border-hover);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--save,
    &--confirm {
      background: #5ca701;
      color: #fff;
      border-color: #5ca701;

      &:hover:not(:disabled) {
        background: #4e8f01;
        border-color: #4e8f01;
      }
    }

    &--delete {
      color: #d32f2f;
      border-color: #d32f2f;

      &:hover:not(:disabled) {
        background: #d32f2f;
        color: #fff;
      }
    }

    &--cancel {
      color: var(--color-text-light, #666);
    }
  }
}
</style>
