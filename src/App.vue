<template>
  <div
    id="app"
    class="App o-container o-container--s o-vertical-spacing o-vertical-spacing--xxl"
  >
    <h1>Hello World</h1>
  </div>
</template>

<script>
export default {
  name: `App`,
};
</script>

<style lang="scss">
@import './assets/scss/settings/spacings';
@import './assets/scss/generic/base';
@import '{
  .o-container,
  .o-container--s,
} from ~@avalanche/object-container';
@import '{
  .o-vertical-spacing,
  .o-vertical-spacing--xxl,
} from ~@avalanche/object-vertical-spacing';

.App {
  padding-top: setting-spacing(xl);
  padding-bottom: setting-spacing(xl);
}
</style>
