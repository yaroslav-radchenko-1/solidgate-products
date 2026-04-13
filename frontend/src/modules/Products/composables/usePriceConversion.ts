import { watch } from 'vue'
import type { PriceRow } from '../types/product.types'
import { useProductStore } from '../stores/productStore'

type UsePriceConversionReturns = {
  recalculateRow: (row: PriceRow) => void
  recalculateAllRows: (rows: PriceRow[]) => void
}

export const usePriceConversion = (rows: () => PriceRow[]): UsePriceConversionReturns => {
  const store = useProductStore()

  const recalculateRow = (row: PriceRow) => {
    if (row.mode !== 'convert') return

    if (row.usdPrice !== null) {
      row.localPrice = store.convertUsdToLocal(row.usdPrice, row.currency)
    } else {
      row.localPrice = null
    }

    if (row.trialUsdPrice !== null) {
      row.trialLocalPrice = store.convertUsdToLocal(row.trialUsdPrice, row.currency)
    } else {
      row.trialLocalPrice = null
    }
  }

  const recalculateAllRows = (targetRows: PriceRow[]) => {
    for (const row of targetRows) {
      recalculateRow(row)
    }
  }

  watch(
    () => store.exchangeRates,
    () => {
      recalculateAllRows(rows())
    },
    { deep: true },
  )

  return { recalculateRow, recalculateAllRows }
}
