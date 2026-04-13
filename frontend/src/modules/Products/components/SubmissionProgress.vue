<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { SubmissionStep } from '../types/product.types'

type SubmissionProgressProps = {
  progress: number
  steps: SubmissionStep[]
  errors: string[]
  isSubmitting: boolean
}

const props = defineProps<SubmissionProgressProps>()

const isCollapsed = ref(false)

const isComplete = computed(
  () => !props.isSubmitting && props.steps.length > 0 && props.errors.length === 0,
)

watch(
  () => props.isSubmitting,
  (submitting, prev) => {
    if (prev && !submitting && props.errors.length === 0) {
      isCollapsed.value = true
    }
    if (submitting) {
      isCollapsed.value = false
    }
  },
)

const toggle = () => {
  isCollapsed.value = !isCollapsed.value
}

const title = computed(() => {
  if (props.isSubmitting) return 'Submitting...'
  if (props.errors.length > 0) return 'Submission finished with errors'
  if (isComplete.value) return 'Submission complete'
  return 'Submission'
})
</script>

<template>
  <div class="submission-progress" :class="{ 'submission-progress--collapsed': isCollapsed }">
    <div class="submission-progress__header">
      <h3 class="submission-progress__title">{{ title }}</h3>
      <button
        v-if="!isSubmitting && steps.length > 0"
        type="button"
        class="submission-progress__toggle"
        @click="toggle"
      >
        {{ isCollapsed ? 'Show details' : 'Hide' }}
      </button>
    </div>
    <template v-if="!isCollapsed">
      <div class="submission-progress__bar-container">
        <div
          class="submission-progress__bar"
          :style="{ width: `${Math.round(progress * 100)}%` }"
        />
      </div>
      <p class="submission-progress__percent">{{ Math.round(progress * 100) }}%</p>
      <ul class="submission-progress__steps">
        <li
          v-for="(step, index) in steps"
          :key="index"
          class="submission-progress__step"
          :class="`submission-progress__step--${step.status}`"
        >
          <span class="submission-progress__step-icon">
            <template v-if="step.status === 'pending'">&#9711;</template>
            <template v-else-if="step.status === 'success'">&#10003;</template>
            <template v-else>&#10007;</template>
          </span>
          <span>{{ step.label }}</span>
          <span v-if="step.error" class="submission-progress__step-error">{{ step.error }}</span>
        </li>
      </ul>
      <div v-if="errors.length > 0" class="submission-progress__errors">
        <p v-for="(error, index) in errors" :key="index" class="submission-progress__error">
          {{ error }}
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.submission-progress {
  background: var(--color-background);
  border: 0.0625rem solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  &--collapsed &__header {
    margin-bottom: 0;
  }

  &__title {
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
    color: var(--color-heading);
  }

  &__toggle {
    background: none;
    border: 0.0625rem solid var(--color-border);
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    cursor: pointer;
    color: var(--color-text);

    &:hover {
      background: var(--color-background-soft);
    }
  }

  &__bar-container {
    height: 0.5rem;
    background: var(--color-background-mute);
    border-radius: 0.25rem;
    overflow: hidden;
  }

  &__bar {
    height: 100%;
    background: #5ca701;
    border-radius: 0.25rem;
    transition: width 0.3s ease;
  }

  &__percent {
    font-size: 0.75rem;
    color: var(--color-text);
    margin: 0.25rem 0 0.75rem;
  }

  &__steps {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__step {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    padding: 0.25rem 0;

    &--pending {
      color: var(--color-text);
      opacity: 0.6;
    }

    &--success {
      color: #5ca701;
    }

    &--error {
      color: #dc2626;
    }
  }

  &__step-icon {
    width: 1rem;
    text-align: center;
    flex-shrink: 0;
  }

  &__step-error {
    font-size: 0.75rem;
    color: #dc2626;
    margin-left: auto;
  }

  &__errors {
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: #fef2f2;
    border-radius: 0.25rem;
  }

  &__error {
    margin: 0;
    font-size: 0.8125rem;
    color: #dc2626;
  }
}
</style>
