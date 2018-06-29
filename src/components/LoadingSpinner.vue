<template>
    <div>
        <span v-if="isLoading">Loading...</span>
        <span v-else-if="isError">Error</span>
        <div v-show="!isLoading&&!isError">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator"

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

@Component
export default class LoadingSpinner extends Vue {

    @Prop({ required: true }) isLoading!: Boolean

    @Prop() isError: Boolean = false

}
</script>

<style scoped>

</style>