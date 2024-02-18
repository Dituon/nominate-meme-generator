<template>
    <Viewer :data-loader="loader"></Viewer>
</template>

<script setup lang="ts">
import Viewer from '@/Viewer.vue';
import { RepoDataLoader } from './loader/repo-data-loader';
import { QQGroupDataLoader } from './loader/qq-group-data-loader';
import config from '@/../config';

const loader = window.self !== window.top ?
    new QQGroupDataLoader() : new RepoDataLoader({
        baseUrl: config.repoLoader.baseUrl
    })
</script>
