<template>
  <v-toolbar density="comfortable" :elevation="8" title="">
    <h3>{{ toolbarTitle }}</h3>
  </v-toolbar>
</template>

<script>
export default {
  props: ['toolbarTitle'], //Props kullanım örneği1 (Root'dan/ana bileşenden alt bileşene veri aktarımı)
  // props:{ //Props kullanım örneği2
  //   toolbarTitle:{
  //     type: String,
  //     required:true
  //   }
  // },
  data() {
    return {
      // toolbarTitle: 'Komponentten Beslenen Toolbar Başlığı'
    }
  }
}
</script>

<!-- <script setup>
import { ref } from 'vue';

// const toolbarTitle = ref('Komponentten Beslenen Toolbar Başlığı');
</script> -->

<style scoped>
h3 {
  margin-left: 15px;
}
</style>
