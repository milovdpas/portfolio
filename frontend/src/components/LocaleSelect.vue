<template>
  <div class="locale-select" role="group" :aria-label="$t('menu.language')">
    <button class="flag-button" :class="{ active: $i18n.locale === 'en' }" @click="select('en')"
            :aria-pressed="$i18n.locale === 'en' ? 'true' : 'false'" aria-label="English">
      <svg viewBox="0 0 60 60" width="44" height="44" aria-hidden="true">
        <defs>
          <clipPath id="flag-circle-en">
            <circle cx="30" cy="30" r="30"/>
          </clipPath>
        </defs>
        <g clip-path="url(#flag-circle-en)">
          <rect width="60" height="60" fill="#012169"/>
          <path d="M0,0 L60,60 M60,0 L0,60" stroke="#FFFFFF" stroke-width="10"/>
          <path d="M0,0 L60,60 M60,0 L0,60" stroke="#C8102E" stroke-width="4"/>
          <path d="M30,0 V60 M0,30 H60" stroke="#FFFFFF" stroke-width="16"/>
          <path d="M30,0 V60 M0,30 H60" stroke="#C8102E" stroke-width="8"/>
        </g>
      </svg>
    </button>
    <button class="flag-button" :class="{ active: $i18n.locale === 'nl' }" @click="select('nl')"
            :aria-pressed="$i18n.locale === 'nl' ? 'true' : 'false'" aria-label="Nederlands">
      <svg viewBox="0 0 60 60" width="44" height="44" aria-hidden="true">
        <defs>
          <clipPath id="flag-circle-nl">
            <circle cx="30" cy="30" r="30"/>
          </clipPath>
        </defs>
        <g clip-path="url(#flag-circle-nl)">
          <rect width="60" height="20" y="0" fill="#AE1C28"/>
          <rect width="60" height="20" y="20" fill="#FFFFFF"/>
          <rect width="60" height="20" y="40" fill="#21468B"/>
        </g>
      </svg>
    </button>
  </div>
</template>

<script>
import {setLocale} from "@/i18n";

export default {
  name: "LocaleSelect",
  methods: {
    select(locale) {
      setLocale(locale);
    }
  }
}
</script>

<style scoped lang="scss">
.locale-select {
  display: flex;
  gap: 0.75em;
}

.flag-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 52px;
  height: 52px;
  padding: 0;
  background: none;
  border: 3px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  filter: grayscale(1) opacity(0.6);
  transition: all 0.3s;

  svg {
    display: block;
    border-radius: 50%;
  }

  &:hover,
  &:focus-visible {
    filter: none;
    transform: scale(1.1);
  }

  &.active {
    filter: none;
    border-color: $white;
    transform: scale(1.1);
  }
}

@include mobile {
  .flag-button {
    width: 40px;
    height: 40px;

    svg {
      width: 34px;
      height: 34px;
    }
  }
}
</style>
