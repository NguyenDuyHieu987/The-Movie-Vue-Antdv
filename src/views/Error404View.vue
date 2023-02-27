<template>
  <a-result status="500" title="404" sub-title="Ops!, The page was not found.">
    <template #extra>
      <a-button size="large" @click="$router.push({ path: '/' })"
        >Back Home</a-button
      >
    </template>
  </a-result>
</template>
<script>
export default {
  setup() {
    document.title = 'Error - 404 Not Found';
  },
};
</script>
