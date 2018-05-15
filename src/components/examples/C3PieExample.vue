<template>
    <div class="card c3-container">
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

import { generate } from 'c3';
import 'c3/c3.css';

@Component
export default class C3PieExample extends Vue {
    
    mounted() {
        let chart = generate({
            bindto: this.$el,
            data: {
                columns: [
                    ['Short', 120],
                    ['Longer Description', 50],
                    ['Even Longer Description', 30],
                    ['Medium Desc.', 40],
                    ['And that\'s all', 10]
                ],
                type : 'pie'
            },
            tooltip: {
                show: false
            }
        });
    }

}
</script>

<style scoped>
    .c3-container {
        height: 300px;
    }
</style>
