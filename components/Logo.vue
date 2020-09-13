<template>
  <div class="w-100 text-center p-4 position-relative" style="z-index:10000">
    <h1 @click="$router.push('/')" class="cursor-pointer font-dancing-script display-1" :class="color"><span class="text-orange">P</span>redicto</h1>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      required: false,
      default: "text-black"
    }
  }
}
</script>

<style>

</style>