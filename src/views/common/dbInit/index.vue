<template>
  <div class="db-init">
    <component :is="currentComponent"/>
  </div>
</template>

<script lang="ts">
import Protocol from "./component/protocol.vue";
import CheckEnv from "./component/checkEnv.vue";
import Finish from "./component/finish.vue"
import Init from "./component/init.vue"
import {defineComponent} from "vue";

export default defineComponent({
  name: "dbInit",
  components: {
    Protocol,
    CheckEnv,
    Finish,
    Init
  },
  provide() {
    return {
      jump: (v: string) => {
        this.currentComponent = v
      }
    }
  },

  setup() {

  },
  data() {
    return {
      currentComponent: 'Protocol'
    }
  }

})
</script>

<style scoped lang="scss">
.db-init {
}
</style>
