<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Settings } from '../types/product.types'

type SettingsPanelProps = {
  settings: Settings
}

type SettingsPanelEmits = {
  save: [settings: Settings]
}

const props = defineProps<SettingsPanelProps>()
const emit = defineEmits<SettingsPanelEmits>()

const isExpanded = ref(false)
const localPublicKey = ref('')
const localSecretKey = ref('')

const handleToggle = () => {
  isExpanded.value = !isExpanded.value
}

const handleSave = () => {
  emit('save', {
    publicKey: localPublicKey.value,
    secretKey: localSecretKey.value,
  })
}

onMounted(() => {
  localPublicKey.value = props.settings.publicKey
  localSecretKey.value = props.settings.secretKey
})
</script>

<template>
  <div class="settings-panel">
    <button class="settings-panel__toggle" type="button" @click="handleToggle">
      <span class="settings-panel__toggle-icon">{{ isExpanded ? '▼' : '▶' }}</span>
      API Settings
    </button>
    <div v-if="isExpanded" class="settings-panel__body">
      <div class="settings-panel__field">
        <label class="settings-panel__label">Public Key</label>
        <input
          v-model="localPublicKey"
          type="text"
          class="settings-panel__input"
          placeholder="Enter public key"
        />
      </div>
      <div class="settings-panel__field">
        <label class="settings-panel__label">Secret Key</label>
        <input
          v-model="localSecretKey"
          type="text"
          class="settings-panel__input"
          placeholder="Enter secret key"
        />
      </div>
      <button class="settings-panel__save" type="button" @click="handleSave">Save Settings</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings-panel {
  background: var(--color-background);
  border: 0.0625rem solid var(--color-border);
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;

  &__toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
    text-align: left;
  }

  &__toggle-icon {
    font-size: 0.625rem;
  }

  &__body {
    padding: 0 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text);
  }

  &__input {
    padding: 0.5rem 0.75rem;
    border: 0.0625rem solid var(--color-border);
    border-radius: 0.25rem;
    font-size: 0.875rem;
    outline: none;

    &:focus {
      border-color: var(--color-border-hover);
    }
  }

  &__save {
    align-self: flex-start;
    padding: 0.5rem 1rem;
    background: #5ca701;
    color: #fff;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background: #4e8f01;
    }
  }
}
</style>
