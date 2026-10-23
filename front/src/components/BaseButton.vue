<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    to?: string;
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    block?: boolean;
    disabled?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    block: false,
    disabled: false,
  },
);

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'));

const bindings = computed(() => {
  if (props.to) return { to: props.to };
  if (props.href) return { href: props.href };
  return { type: props.type, disabled: props.disabled };
});
</script>

<template>
  <component
    :is="tag"
    v-bind="bindings"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]"
  >
    <slot />
  </component>
</template>
