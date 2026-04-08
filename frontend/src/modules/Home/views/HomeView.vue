<script setup lang="ts"></script>

<template>
  <main class="home">
    <section class="hero">
      <div class="hero__badge">Vibe Project Template</div>
      <h1 class="hero__title">
        Welcome to your<br /><span class="hero__accent">Liven project</span>
      </h1>
      <p class="hero__subtitle">
        Your app is up and running. Describe what you want to build in plain language — Claude will
        write the code for you.
      </p>
      <div class="hero__cta">
        <div class="cta-card">
          <div class="cta-card__icon">💬</div>
          <p>Just type what you want to build and Claude will handle the rest</p>
        </div>
      </div>
    </section>

    <section class="info">
      <h2 class="info__title">What's inside</h2>
      <div class="info__grid">
        <div class="info__card">
          <div class="info__card-icon">⚡</div>
          <h3>Vue 3 Frontend</h3>
          <p>
            Modern reactive UI with TypeScript, Pinia state management, and Vue Router — running on
            port 5173.
          </p>
        </div>
        <div class="info__card">
          <div class="info__card-icon">🛠️</div>
          <h3>NestJS Backend</h3>
          <p>Scalable API server with TypeScript and SQLite database — running on port 3000.</p>
        </div>
        <div class="info__card">
          <div class="info__card-icon">🔗</div>
          <h3>Already connected</h3>
          <p>
            Frontend and backend are wired together. API calls work out of the box — no setup
            needed.
          </p>
        </div>
        <div class="info__card">
          <div class="info__card-icon">🚀</div>
          <h3>Production ready</h3>
          <p>One build command creates a single deployable app served from a single port.</p>
        </div>
      </div>
    </section>

    <section class="commands">
      <h2 class="commands__title">Useful commands</h2>
      <p class="commands__subtitle">Type these inside Claude Code to manage your project:</p>
      <div class="commands__list">
        <div class="commands__item">
          <code>/save</code>
          <span>Save and upload all changes to GitHub</span>
        </div>
        <div class="commands__item">
          <code>/sync</code>
          <span>Download latest changes from GitHub</span>
        </div>
        <div class="commands__item">
          <code>/lint</code>
          <span>Fix all code style issues automatically</span>
        </div>
      </div>
    </section>

    <footer class="home__footer">
      <p>Built with ❤️ by <strong>Liven</strong></p>
    </footer>
  </main>
</template>

<style scoped lang="scss">
.home {
  max-width: 56rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  font-family: 'Inter', system-ui, sans-serif;
  color: #1b2932;
}

// Hero
.hero {
  text-align: center;
  padding: 3rem 0 4rem;

  &__badge {
    display: inline-block;
    background: #eef2f5;
    color: #486d84;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 0.375rem 1rem;
    border-radius: 2rem;
    margin-bottom: 1.5rem;
  }

  &__title {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1.15;
    margin: 0 0 1.25rem;
    color: #1b2932;
  }

  &__accent {
    color: #5ca701;
  }

  &__subtitle {
    font-size: 1.125rem;
    color: #486d84;
    max-width: 36rem;
    margin: 0 auto 2.5rem;
    line-height: 1.6;
  }

  &__cta {
    display: flex;
    justify-content: center;
  }
}

.cta-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f9fafb;
  border: 1px solid #dee7ed;
  border-radius: 1rem;
  padding: 1.25rem 2rem;
  max-width: 28rem;
  text-align: left;

  &__icon {
    font-size: 1.75rem;
    flex-shrink: 0;
  }

  p {
    margin: 0;
    font-size: 0.9375rem;
    color: #486d84;
    line-height: 1.5;
  }
}

// Info section
.info {
  padding: 2rem 0;

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1.5rem;
    color: #1b2932;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    @media (max-width: 40rem) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background: #fff;
    border: 1px solid #dee7ed;
    border-radius: 1rem;
    padding: 1.5rem;

    &-icon {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
    }

    h3 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      color: #1b2932;
    }

    p {
      margin: 0;
      font-size: 0.875rem;
      color: #486d84;
      line-height: 1.6;
    }
  }
}

// Commands section
.commands {
  padding: 2rem 0;

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
    color: #1b2932;
  }

  &__subtitle {
    color: #486d84;
    margin: 0 0 1.25rem;
    font-size: 0.9375rem;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #f9fafb;
    border: 1px solid #dee7ed;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;

    code {
      font-family: 'SFMono-Regular', 'Consolas', monospace;
      font-size: 0.875rem;
      font-weight: 600;
      color: #5ca701;
      background: #eef2f5;
      padding: 0.25rem 0.625rem;
      border-radius: 0.375rem;
      flex-shrink: 0;
    }

    span {
      font-size: 0.9375rem;
      color: #486d84;
    }
  }
}

// Footer
.home__footer {
  text-align: center;
  padding-top: 3rem;
  color: #7aa0b7;
  font-size: 0.875rem;

  strong {
    color: #5ca701;
  }
}
</style>
