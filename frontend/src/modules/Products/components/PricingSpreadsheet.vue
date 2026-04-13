<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import type { PriceRow, PriceMode } from '../types/product.types'
import CountryAutocomplete from './CountryAutocomplete.vue'

type GroupEmoji = Record<string, string>

const GROUP_EMOJIS: GroupEmoji = {
  UK: '\u{1F1EC}\u{1F1E7}',
  'Europe > Western / Core': '\u{1F1EA}\u{1F1FA}',
  'Europe > Southern': '\u{1F1EA}\u{1F1FA}',
  'Europe > Nordics': '\u{1F1EA}\u{1F1FA}',
  'Europe > Lower / Mixed': '\u{1F1EA}\u{1F1FA}',
  'Europe > Eastern & Balkan': '\u{1F1EA}\u{1F1FA}',
  'Europe > Territories': '\u{1F1EA}\u{1F1FA}',
  Japan: '\u{1F1EF}\u{1F1F5}',
  Canada: '\u{1F1E8}\u{1F1E6}',
  Australia: '\u{1F1E6}\u{1F1FA}',
  'South Korea': '\u{1F1F0}\u{1F1F7}',
  'Latin America': '\u{1F30E}',
  Other: '\u{1F30D}',
  custom: '\u{2795}',
}

type PricingSpreadsheetProps = {
  rows: PriceRow[]
  isDragFilling: boolean
  dragFillRange: { start: number; end: number } | null
  hasTrial: boolean
}

type PricingSpreadsheetEmits = {
  setPrice: [index: number, field: keyof PriceRow, value: number | null]
  setCurrency: [index: number, currency: string]
  setMode: [index: number, mode: PriceMode]
  setCountryBoth: [index: number, name: string, code: string]
  startDragFill: [index: number, column: string, shiftKey: boolean]
  updateDragFill: [index: number]
  endDragFill: []
  addRowAbove: [index: number]
  addRowBelow: [index: number]
  removeRow: [index: number]
  addRowAtEnd: []
}

const props = defineProps<PricingSpreadsheetProps>()
const emit = defineEmits<PricingSpreadsheetEmits>()

const collapsedGroups = ref<Set<string>>(new Set())
const contextMenuIndex = ref<number | null>(null)
const contextMenuPosition = ref({ x: 0, y: 0 })

type RowWithGroup =
  | {
      type: 'header'
      label: string
      emoji: string
      groupKey: string
    }
  | {
      type: 'row'
      row: PriceRow
      globalIndex: number
      groupKey: string
    }

const flatRows = computed<RowWithGroup[]>(() => {
  const result: RowWithGroup[] = []
  let lastGroupKey = ''

  for (let i = 0; i < props.rows.length; i++) {
    const row = props.rows[i]
    if (!row) continue

    const groupKey = row.groupKey

    if (groupKey !== lastGroupKey && groupKey !== 'default') {
      result.push({
        type: 'header',
        label: groupKey,
        emoji: GROUP_EMOJIS[groupKey] ?? '',
        groupKey,
      })
      lastGroupKey = groupKey
    } else if (groupKey === 'default') {
      lastGroupKey = groupKey
    }

    if (groupKey !== 'default' && collapsedGroups.value.has(groupKey)) {
      continue
    }

    result.push({
      type: 'row',
      row,
      globalIndex: i,
      groupKey,
    })
  }

  return result
})

const handleToggleGroup = (groupKey: string) => {
  if (collapsedGroups.value.has(groupKey)) {
    collapsedGroups.value.delete(groupKey)
  } else {
    collapsedGroups.value.add(groupKey)
  }
}

const handlePriceInput = (index: number, field: keyof PriceRow, event: Event) => {
  const target = event.target as HTMLInputElement
  const raw = target.value.trim()
  if (raw === '') {
    emit('setPrice', index, field, null)
    return
  }
  const num = Number(raw)
  if (Number.isNaN(num)) return
  emit('setPrice', index, field, num)
}

const handlePriceBlur = (index: number, field: keyof PriceRow, event: Event) => {
  const target = event.target as HTMLInputElement
  const raw = target.value.trim()
  if (raw === '') return
  const num = Number(raw)
  if (Number.isNaN(num)) return
  const rounded = Math.round(num * 100) / 100
  emit('setPrice', index, field, rounded)
}

const isInDragRange = (globalIndex: number): boolean => {
  if (!props.isDragFilling || !props.dragFillRange) return false
  return globalIndex >= props.dragFillRange.start && globalIndex <= props.dragFillRange.end
}

const handleMouseUp = () => {
  if (props.isDragFilling) {
    emit('endDragFill')
  }
}

const handleContextMenu = (event: MouseEvent, globalIndex: number) => {
  event.preventDefault()
  contextMenuIndex.value = globalIndex
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
}

const handleCloseContextMenu = () => {
  contextMenuIndex.value = null
}

const handleAddAbove = () => {
  if (contextMenuIndex.value !== null) {
    emit('addRowAbove', contextMenuIndex.value)
  }
  contextMenuIndex.value = null
}

const handleAddBelow = () => {
  if (contextMenuIndex.value !== null) {
    emit('addRowBelow', contextMenuIndex.value)
  }
  contextMenuIndex.value = null
}

const handleRemoveRow = () => {
  if (contextMenuIndex.value !== null) {
    emit('removeRow', contextMenuIndex.value)
  }
  contextMenuIndex.value = null
}

const colCount = computed(() => (props.hasTrial ? 8 : 6))

const pointerY = ref(0)
let scrollRafId = 0

const SCROLL_EDGE = 80
const SCROLL_MAX_SPEED = 20

const scrollStep = () => {
  const viewportHeight = window.innerHeight
  const distanceFromTop = pointerY.value
  const distanceFromBottom = viewportHeight - pointerY.value
  let delta = 0
  if (distanceFromTop < SCROLL_EDGE) {
    delta = -Math.ceil(((SCROLL_EDGE - distanceFromTop) / SCROLL_EDGE) * SCROLL_MAX_SPEED)
  } else if (distanceFromBottom < SCROLL_EDGE) {
    delta = Math.ceil(((SCROLL_EDGE - distanceFromBottom) / SCROLL_EDGE) * SCROLL_MAX_SPEED)
  }
  if (delta !== 0) window.scrollBy(0, delta)
  scrollRafId = requestAnimationFrame(scrollStep)
}

const handleDragMouseMove = (event: MouseEvent) => {
  pointerY.value = event.clientY
}

const startAutoScroll = () => {
  window.addEventListener('mousemove', handleDragMouseMove)
  scrollRafId = requestAnimationFrame(scrollStep)
}

const stopAutoScroll = () => {
  window.removeEventListener('mousemove', handleDragMouseMove)
  if (scrollRafId) {
    cancelAnimationFrame(scrollRafId)
    scrollRafId = 0
  }
}

watch(
  () => props.isDragFilling,
  (active) => {
    if (active) startAutoScroll()
    else stopAutoScroll()
  },
)

onBeforeUnmount(stopAutoScroll)
</script>

<template>
  <div
    class="spreadsheet"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
    @click="handleCloseContextMenu"
  >
    <h2 class="spreadsheet__title">Pricing</h2>
    <div class="spreadsheet__table-wrapper">
      <table class="spreadsheet__table">
        <thead>
          <tr>
            <th class="spreadsheet__th spreadsheet__th--country">Country</th>
            <th class="spreadsheet__th spreadsheet__th--code">Country Code</th>
            <th class="spreadsheet__th spreadsheet__th--currency">Currency</th>
            <th class="spreadsheet__th spreadsheet__th--mode">Currency Mode</th>
            <th class="spreadsheet__th spreadsheet__th--price">USD Price</th>
            <th class="spreadsheet__th spreadsheet__th--price">Local Price</th>
            <th v-if="hasTrial" class="spreadsheet__th spreadsheet__th--price">Trial USD Price</th>
            <th v-if="hasTrial" class="spreadsheet__th spreadsheet__th--price">
              Trial Local Price
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, idx) in flatRows" :key="idx">
            <tr v-if="item.type === 'header'" class="spreadsheet__group-header">
              <td :colspan="colCount" class="spreadsheet__group-cell">
                <button
                  class="spreadsheet__group-toggle"
                  type="button"
                  @click="handleToggleGroup(item.groupKey)"
                >
                  {{ collapsedGroups.has(item.groupKey) ? '\u25B6' : '\u25BC' }}
                </button>
                <span>{{ item.emoji }} {{ item.label }}</span>
              </td>
            </tr>
            <tr
              v-else
              class="spreadsheet__row"
              :class="{
                'spreadsheet__row--default': item.row.isDefault,
                'spreadsheet__row--drag-highlight': isInDragRange(item.globalIndex),
              }"
              @mousemove="emit('updateDragFill', item.globalIndex)"
              @contextmenu="handleContextMenu($event, item.globalIndex)"
            >
              <!-- Country Name -->
              <td class="spreadsheet__cell spreadsheet__cell--country">
                <span v-if="item.row.isDefault">{{ item.row.countryName }}</span>
                <CountryAutocomplete
                  v-else
                  :value="item.row.countryName"
                  field="name"
                  placeholder="Country name"
                  @update="
                    (name: string, code: string) =>
                      emit('setCountryBoth', item.globalIndex, name, code)
                  "
                />
              </td>

              <!-- Country Code -->
              <td class="spreadsheet__cell spreadsheet__cell--code">
                <span v-if="item.row.isDefault">&mdash;</span>
                <CountryAutocomplete
                  v-else
                  :value="item.row.country"
                  field="code"
                  @update="
                    (name: string, code: string) =>
                      emit('setCountryBoth', item.globalIndex, name, code)
                  "
                />
              </td>

              <!-- Currency -->
              <td class="spreadsheet__cell spreadsheet__cell--currency">
                <input
                  type="text"
                  class="spreadsheet__cell-input spreadsheet__cell-input--upper"
                  :value="item.row.currency"
                  maxlength="3"
                  @input="
                    emit(
                      'setCurrency',
                      item.globalIndex,
                      ($event.target as HTMLInputElement).value.toUpperCase(),
                    )
                  "
                />
                <span
                  class="spreadsheet__drag-handle"
                  @mousedown.prevent="
                    emit('startDragFill', item.globalIndex, 'currency', $event.shiftKey)
                  "
                />
              </td>

              <!-- Currency Mode -->
              <td class="spreadsheet__cell spreadsheet__cell--mode">
                <select
                  class="spreadsheet__cell-select"
                  :value="item.row.mode"
                  @change="
                    emit(
                      'setMode',
                      item.globalIndex,
                      ($event.target as HTMLSelectElement).value as PriceMode,
                    )
                  "
                >
                  <option value="convert">Convert</option>
                  <option value="local">Local</option>
                </select>
                <span
                  class="spreadsheet__drag-handle"
                  @mousedown.prevent="
                    emit('startDragFill', item.globalIndex, 'mode', $event.shiftKey)
                  "
                />
              </td>

              <!-- USD Price -->
              <td class="spreadsheet__cell spreadsheet__cell--price">
                <input
                  type="text"
                  inputmode="decimal"
                  class="spreadsheet__cell-input"
                  :value="item.row.usdPrice ?? ''"
                  :readonly="item.row.mode === 'local' && !item.row.isDefault"
                  @input="handlePriceInput(item.globalIndex, 'usdPrice', $event)"
                  @blur="handlePriceBlur(item.globalIndex, 'usdPrice', $event)"
                />
                <span
                  class="spreadsheet__drag-handle"
                  @mousedown.prevent="
                    emit('startDragFill', item.globalIndex, 'usdPrice', $event.shiftKey)
                  "
                />
              </td>

              <!-- Local Price -->
              <td class="spreadsheet__cell spreadsheet__cell--price">
                <input
                  type="text"
                  inputmode="decimal"
                  class="spreadsheet__cell-input"
                  :value="item.row.localPrice ?? ''"
                  :readonly="item.row.mode === 'convert' && !item.row.isDefault"
                  @input="handlePriceInput(item.globalIndex, 'localPrice', $event)"
                  @blur="handlePriceBlur(item.globalIndex, 'localPrice', $event)"
                />
                <span
                  class="spreadsheet__drag-handle"
                  @mousedown.prevent="
                    emit('startDragFill', item.globalIndex, 'localPrice', $event.shiftKey)
                  "
                />
              </td>

              <!-- Trial USD Price -->
              <td v-if="hasTrial" class="spreadsheet__cell spreadsheet__cell--price">
                <input
                  type="text"
                  inputmode="decimal"
                  class="spreadsheet__cell-input"
                  :value="item.row.trialUsdPrice ?? ''"
                  :readonly="item.row.mode === 'local' && !item.row.isDefault"
                  @input="handlePriceInput(item.globalIndex, 'trialUsdPrice', $event)"
                  @blur="handlePriceBlur(item.globalIndex, 'trialUsdPrice', $event)"
                />
                <span
                  class="spreadsheet__drag-handle"
                  @mousedown.prevent="
                    emit('startDragFill', item.globalIndex, 'trialUsdPrice', $event.shiftKey)
                  "
                />
              </td>

              <!-- Trial Local Price -->
              <td v-if="hasTrial" class="spreadsheet__cell spreadsheet__cell--price">
                <input
                  type="text"
                  inputmode="decimal"
                  class="spreadsheet__cell-input"
                  :value="item.row.trialLocalPrice ?? ''"
                  :readonly="item.row.mode === 'convert' && !item.row.isDefault"
                  @input="handlePriceInput(item.globalIndex, 'trialLocalPrice', $event)"
                  @blur="handlePriceBlur(item.globalIndex, 'trialLocalPrice', $event)"
                />
                <span
                  class="spreadsheet__drag-handle"
                  @mousedown.prevent="
                    emit('startDragFill', item.globalIndex, 'trialLocalPrice', $event.shiftKey)
                  "
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <button class="spreadsheet__add-row" type="button" @click="emit('addRowAtEnd')">
      + Add row
    </button>

    <!-- Context menu -->
    <div
      v-if="contextMenuIndex !== null"
      class="spreadsheet__context-menu"
      :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }"
      @click.stop
    >
      <button class="spreadsheet__context-item" type="button" @click="handleAddAbove">
        Insert row above
      </button>
      <button class="spreadsheet__context-item" type="button" @click="handleAddBelow">
        Insert row below
      </button>
      <button
        v-if="contextMenuIndex !== 0"
        class="spreadsheet__context-item spreadsheet__context-item--danger"
        type="button"
        @click="handleRemoveRow"
      >
        Remove row
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.spreadsheet {
  background: var(--color-background);
  border: 0.0625rem solid var(--color-border);
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  overflow: visible;
  position: relative;

  &__title {
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
    padding: 1rem 1.25rem;
    color: var(--color-heading);
    border-bottom: 0.0625rem solid var(--color-border);
  }

  &__table-wrapper {
    overflow-x: auto;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
  }

  &__th {
    text-align: left;
    padding: 0.5rem;
    font-weight: 600;
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: var(--color-text);
    background: var(--color-background-soft);
    border-bottom: 0.0625rem solid var(--color-border);
    white-space: nowrap;

    &--country {
      min-width: 10rem;
    }

    &--code {
      width: 6rem;
    }

    &--currency {
      width: 5rem;
    }

    &--mode {
      width: 6.5rem;
    }

    &--price {
      width: 7.5rem;
    }
  }

  &__group-header {
    background: var(--color-background-mute);
  }

  &__group-cell {
    padding: 0.375rem 0.625rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-text);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__group-toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.5rem;
    padding: 0;
    color: var(--color-text);
  }

  &__row {
    &--default {
      background: var(--color-background-soft);
      font-weight: 600;
    }

    &--drag-highlight {
      background: #dbeafe;
    }
  }

  &__cell {
    padding: 0.125rem 0.25rem;
    height: 2.25rem;
    border-bottom: 0.0625rem solid var(--color-border);
    vertical-align: middle;

    &--country {
      white-space: nowrap;
      padding: 0.125rem 0.375rem;
    }

    &--code {
      width: 6rem;
    }

    &--currency {
      width: 5rem;
      position: relative;
    }

    &--mode {
      width: 6.5rem;
      position: relative;
    }

    &--price {
      position: relative;
    }
  }

  &__cell-input {
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

    &[readonly] {
      background: var(--color-background-mute);
      color: var(--color-text);
      opacity: 0.6;
      border-color: transparent;
    }

    &--upper {
      text-transform: uppercase;
    }
  }

  &__cell-select {
    width: 100%;
    border: 0.0625rem solid var(--color-border);
    border-radius: 0.1875rem;
    background: var(--color-background);
    font-size: 0.8125rem;
    padding: 0.125rem 0.25rem;
    outline: none;
    color: var(--color-text);
    cursor: pointer;
    height: 1.75rem;

    &:focus {
      border-color: #3b82f6;
    }
  }

  &__drag-handle {
    position: absolute;
    bottom: 0.1875rem;
    right: 0.1875rem;
    width: 0.4375rem;
    height: 0.4375rem;
    background: #3b82f6;
    cursor: crosshair;

    &:hover {
      background: #2563eb;
    }
  }

  &__add-row {
    display: block;
    width: 100%;
    padding: 0.5rem;
    background: none;
    border: none;
    border-top: 0.0625rem solid var(--color-border);
    color: #3b82f6;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    text-align: center;

    &:hover {
      background: var(--color-background-soft);
    }
  }

  &__context-menu {
    position: fixed;
    z-index: 100;
    background: var(--color-background);
    border: 0.0625rem solid var(--color-border);
    border-radius: 0.375rem;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.12);
    padding: 0.25rem 0;
    min-width: 10rem;
  }

  &__context-item {
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    background: none;
    border: none;
    text-align: left;
    font-size: 0.8125rem;
    cursor: pointer;
    color: var(--color-text);

    &:hover {
      background: var(--color-background-soft);
    }

    &--danger {
      color: #dc2626;
    }
  }
}
</style>
