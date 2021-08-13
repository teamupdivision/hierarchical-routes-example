<template>
  <div>
    <div>Route: <strong>{{ $route.path }}</strong></div>
    <div>Params: <strong>{{ JSON.stringify($route.params) }}</strong></div>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>
