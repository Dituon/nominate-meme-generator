<template>
  <p style="opacity: 0.5;">
    <span v-if="config.app.siteWatermark">
      Create By {{ location.origin + location.pathname }}
    </span>
    <br/>
    <span v-if="config.app.userWatermark">
      @{{ config.user.name }}
    </span>
  </p>
</template>
<script setup lang="ts">
import { config } from '@/utils/reactive-config';

const location = window.location

</script>