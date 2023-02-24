<template>
  <div>
    <a-switch v-model:checked="checked1" size="small" />
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from 'vue';
export default defineComponent({
  setup() {
    const state = reactive({
      checked1: true,
      checked2: false,
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>
