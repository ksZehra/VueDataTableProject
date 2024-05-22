<template>
  <div>
    <h3 v-on:click="changeTitle">{{ h3Title }}
    </h3>
  </div>
</template>

<script>
export default {
  data() {
    return {
      h3Title: "CpOptionsTest.vue'da tanımlı olan başlık"
    }
  },
  methods: {
    changeTitle: function () {
      this.$emit("basligiDegistir", "Alt Bileşen Tarafından Değiştirilen Başlık")
    }
  },
  watch: {
    title(newTitle) {
      this.h3Title = newTitle;
    }
  }
}
</script>
