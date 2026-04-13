<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  AVAILABLE_COUNTRIES,
  COUNTRY_BY_CODE,
  COUNTRY_BY_NAME,
} from '../consts/availableCountries.consts'

type CountryAutocompleteProps = {
  value: string
  field: 'name' | 'code'
  placeholder?: string
}

type CountryAutocompleteEmits = {
  update: [name: string, code: string]
}

const props = defineProps<CountryAutocompleteProps>()
const emit = defineEmits<CountryAutocompleteEmits>()

const searchText = ref(props.value)
const isOpen = ref(false)
const hasError = ref(false)
const activeIndex = ref(-1)

watch(
  () => props.value,
  (val) => {
    searchText.value = val
    hasError.value = false
  },
)

const filteredCountries = computed(() => {
  const query = searchText.value.trim()
  if (!query) return AVAILABLE_COUNTRIES.slice(0, 50)

  if (props.field === 'name') {
    const lower = query.toLowerCase()
    const startsWith = AVAILABLE_COUNTRIES.filter((c) => c.name.toLowerCase().startsWith(lower))
    const contains = AVAILABLE_COUNTRIES.filter(
      (c) => !c.name.toLowerCase().startsWith(lower) && c.name.toLowerCase().includes(lower),
    )
    return [...startsWith, ...contains].slice(0, 50)
  }

  const upper = query.toUpperCase()
  return AVAILABLE_COUNTRIES.filter((c) => c.code.startsWith(upper)).slice(0, 50)
})

const selectItem = (item: { name: string; code: string }) => {
  searchText.value = props.field === 'name' ? item.name : item.code
  hasError.value = false
  isOpen.value = false
  activeIndex.value = -1
  emit('update', item.name, item.code)
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchText.value = target.value
  isOpen.value = true
  activeIndex.value = -1
  hasError.value = false

  // Auto-fill on exact match
  if (props.field === 'name') {
    const match = COUNTRY_BY_NAME.get(target.value.trim().toLowerCase())
    if (match) {
      emit('update', match.name, match.code)
    }
  } else {
    const match = COUNTRY_BY_CODE.get(target.value.trim().toUpperCase())
    if (match) {
      emit('update', match.name, match.code)
    }
  }
}

const handleFocus = () => {
  isOpen.value = true
  updateDropdownPosition()
}

const handleBlur = () => {
  // Delay to allow mousedown on dropdown item
  setTimeout(() => {
    isOpen.value = false
    activeIndex.value = -1

    const text = searchText.value.trim()
    if (!text) {
      hasError.value = false
      return
    }

    if (props.field === 'name') {
      hasError.value = !COUNTRY_BY_NAME.has(text.toLowerCase())
    } else {
      hasError.value = !COUNTRY_BY_CODE.has(text.toUpperCase())
    }
  }, 150)
}

const inputEl = ref<HTMLInputElement | null>(null)
const dropdownStyle = ref<Record<string, string>>({})

const updateDropdownPosition = () => {
  if (!inputEl.value) return
  const rect = inputEl.value.getBoundingClientRect()
  dropdownStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 2}px`,
    left: `${rect.left}px`,
    width: `${Math.max(rect.width, 192)}px`,
    zIndex: '200',
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (!isOpen.value) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, filteredCountries.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, -1)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const item = filteredCountries.value[activeIndex.value]
    if (item) {
      selectItem(item)
    }
  } else if (event.key === 'Escape') {
    isOpen.value = false
  }
}
</script>

<template>
  <div class="country-autocomplete">
    <input
      ref="inputEl"
      class="country-autocomplete__input"
      :class="{
        'country-autocomplete__input--upper': field === 'code',
        'country-autocomplete__input--error': hasError,
      }"
      :value="searchText"
      :placeholder="placeholder"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeyDown"
    />
    <Teleport to="body">
      <ul
        v-if="isOpen && filteredCountries.length > 0"
        class="country-autocomplete__dropdown"
        :style="dropdownStyle"
      >
        <li
          v-for="(item, i) in filteredCountries"
          :key="item.code"
          class="country-autocomplete__item"
          :class="{ 'country-autocomplete__item--active': i === activeIndex }"
          @mousedown.prevent="selectItem(item)"
        >
          {{ item.name }} ({{ item.code }})
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.country-autocomplete {
  position: relative;
  width: 100%;

  &__input {
    width: 100%;
    border: 0.0625rem solid var(--color-border);
    border-radius: 0.1875rem;
    background: var(--color-background);
    font-size: 0.8125rem;
    padding: 0.25rem 0.375rem;
    outline: none;
    color: var(--color-text);
    height: 1.75rem;
    box-sizing: border-box;

    &:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 0.0625rem rgba(59, 130, 246, 0.2);
    }

    &--upper {
      text-transform: uppercase;
    }

    &--error {
      border-color: #dc2626;
      box-shadow: 0 0 0 0.0625rem rgba(220, 38, 38, 0.2);
    }
  }
}
</style>

<style>
.country-autocomplete__dropdown {
  max-height: 10rem;
  overflow-y: auto;
  background: var(--color-background, #fff);
  border: 0.0625rem solid var(--color-border, #ddd);
  border-radius: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  min-width: 12rem;
}

.country-autocomplete__item {
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  cursor: pointer;
}

.country-autocomplete__item:hover,
.country-autocomplete__item--active {
  background: var(--color-background-soft, #f8f8f8);
}
</style>
