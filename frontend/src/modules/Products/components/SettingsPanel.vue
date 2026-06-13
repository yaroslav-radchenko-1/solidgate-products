<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Settings, SettingsUpdate } from '../types/product.types'

type SettingsPanelProps = {
  settings: Settings
}

type SettingsPanelEmits = {
  save: [update: SettingsUpdate]
}

const props = defineProps<SettingsPanelProps>()
const emit = defineEmits<SettingsPanelEmits>()

const isExpanded = ref(false)
const localPublicKey = ref('')
// The secret key is never sent to the client, so this field always starts
// empty. Leaving it blank on save keeps the stored secret unchanged.
const localSecretKey = ref('')

const canSave = computed(() => {
  if (!localPublicKey.value.trim()) return false
  // A secret must be entered at least once, when none is stored yet.
  if (!props.settings.hasSecretKey && !localSecretKey.value.trim()) return false
  return true
})

const handleToggle = () => {
  isExpanded.value = !isExpanded.value
}

const handleSave = () => {
  if (!canSave.value) return

  const secretKey = localSecretKey.value.trim()
  emit('save', {
    publicKey: localPublicKey.value.trim(),
    ...(secretKey ? { secretKey } : {}),
  })
  localSecretKey.value = ''
}

// Keep the public-key field in sync with loaded/saved settings, and open the
// panel automatically when keys still need to be configured.
watch(
  () => props.settings,
  (settings) => {
    localPublicKey.value = settings.publicKey
    localSecretKey.value = ''
    if (!settings.publicKey || !settings.hasSecretKey) {
      isExpanded.value = true
    }
  },
  { immediate: true },
)
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
        <label class="settings-panel__label">
          Secret Key
          <span
            class="settings-panel__status"
            :class="{ 'settings-panel__status--set': settings.hasSecretKey }"
          >
            {{ settings.hasSecretKey ? 'saved ✓' : 'not set' }}
          </span>
        </label>
        <input
          v-model="localSecretKey"
          type="password"
          autocomplete="off"
          class="settings-panel__input"
          :placeholder="
            settings.hasSecretKey ? 'Leave blank to keep current secret key' : 'Enter secret key'
          "
        />
      </div>
      <button class="settings-panel__save" type="button" :disabled="!canSave" @click="handleSave">
        Save Settings
      </button>
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
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text);
  }

  &__status {
    font-weight: 500;
    color: #a05a00;

    &--set {
      color: #5ca701;
    }
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
