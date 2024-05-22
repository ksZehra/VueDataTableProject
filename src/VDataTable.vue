<template>
  <cp-toolbar></cp-toolbar>
  <v-app>
    <v-main style="padding:20px;">
      <v-card title="Nutrition" flat>
        <template v-slot:text>
          <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details
            single-line></v-text-field>
        </template>

        <!-- <v-data-table :headers="headers" :items="tableItems" :search="search">
          <template v-slot:item.actions="{ tableItems }">
            <td>
              <v-icon @click="deleteItem(tableItems.ID)">mdi-delete</v-icon>
              <v-icon @click="updateItem(tableItems)">mdi-pencil</v-icon>
            </td>
          </template>
        </v-data-table> -->
        <v-data-table :headers="headers" :items="tableItems" :search="search">
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-center">{{ item.id }}</td>
              <td class="text-center">{{ item.ad }}</td>
              <td class="text-center">{{ item.soyad }}</td>
              <td class="text-center">{{ item.yas }}</td>
              <td class="text-center">{{ item.cinsiyet }}</td>
              <td class="text-center">
                <v-icon @click="deleteItem(item.id)">mdi-delete</v-icon>
              </td>
              <td class="text-center">
                <v-icon @click="updateItem(item)">mdi-pencil</v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>

      <div class="pa-4 text-center">
        <v-dialog v-model="dialog" max-width="800">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account" text="Ekle" variant="tonal"
              v-bind="activatorProps"></v-btn>
          </template>

          <v-card prepend-icon="mdi-account" title="Form Elamanları">
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="6" sm="6">
                  <v-text-field label="Ad*" required v-model="inputDatas.ad"></v-text-field>
                </v-col>

                <v-col cols="12" md="6" sm="6">
                  <v-text-field hint="Hint açıklama soyad" label="Soyad" v-model="inputDatas.soyad"></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select :items="[10, 20, 25, 30, 35, 40, 50, 60, 70]" label="Yaş*" required
                    v-model="inputDatas.yas"></v-select>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete :items="['Kadın', 'Erkek']" label="Cinsiyet" auto-select-first multiple
                    v-model="inputDatas.cinsiyet"></v-autocomplete>
                </v-col>
              </v-row>

              <small class="text-caption text-medium-emphasis">*Zorunlu alan</small>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text="Kapat" variant="plain" @click="dialog = false"></v-btn>

              <v-btn color="primary" text="Kaydet" variant="tonal" @click="submitForm"></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <CpLocalFooter></CpLocalFooter>
    </v-main>
  </v-app>

</template>


<script setup>
import { ref } from 'vue'
import { shallowRef } from 'vue'
import axios from 'axios'
import { onMounted } from 'vue';
import CpLocalFooter from './CpLocalFooter';

const search = ref('')
const headers = ref([
  { key: 'id', title: 'Id', align: 'center', sortable: true },
  { key: 'ad', title: 'Ad', align: 'center' },
  { key: 'soyad', title: 'Soyad', align: 'center' },
  { key: 'yas', title: 'Yaş', align: 'center' },
  { key: 'cinsiyet', title: 'Cinsiyet', align: 'center' },
  { key: 'silId', title: 'Sil', align: 'center' },
  { key: 'silGuncelle', title: 'Güncelle', align: 'center' },
])
const tableItems = ref([])
const inputDatas = ref({
  id: '',
  ad: '',
  soyad: '',
  yas: '',
  cinsiyet: ''
})
const dialog = shallowRef(false)

const getService = () => {
  axios.get('https://localhost:44322/api/ZK/GetAll')
    .then(response => {
      tableItems.value = response.data;
    })
    .catch(error => {
      console.error('Get Hata Mesajı:', error);
    });
}

const submitForm = () => {

  console.log(inputDatas);
  const oldId = inputDatas.value.id;
  console.log(oldId);

  if (oldId > 0) {
    updateItem();
  }
  else {
    postService();
  }

  clearFormInputs();
  dialog.value = false;
}

const postService = (inputDatas) => {
  console.log(inputDatas);
  axios.post('https://localhost:44322/api/ZK', inputDatas)
    .then(response => {
      console.log('Post işlemi başarılı. Response data:', response.data);
    })
    .catch(error => {
      console.error('Post hata mesajı:', error);
    });
}

const updateItem = (tableItems) => {
  dialog.value = true;
  inputDatas.value = {
    id: tableItems.id,
    ad: tableItems.ad,
    soyad: tableItems.soyad,
    yas: tableItems.yas,
    cinsiyet: tableItems.cinsiyet
  };

  const itemId = tableItems.id;

  // Güncellenecek verilerin yeni değerleri burada alınabilir
  const newData = {
    ad: inputDatas.value.ad,
    soyad: inputDatas.value.soyad,
    yas: inputDatas.value.yas,
    cinsiyet: inputDatas.value.cinsiyet
  };

  axios.put(`https://localhost:44322/api/ZK/${itemId}`, newData)
    .then(response => {
      console.log('Öğe başarıyla güncellendi:', response.data);
      getService();
    })
    .catch(error => {
      console.error('Öğe güncellenirken hata oluştu:', error);
    });
}

const deleteItem = (id) => {
  axios.delete('https://localhost:44322/api/ZK/' + id)
    .then(response => {
      tableItems.value = tableItems.value.filter(item => item.id !== id);
      console.log('Kayıt başarıyla silindi:', id);
    })
    .catch(error => {
      console.error('Kayıt silinirken hata oluştu:', error);
    });
}

const clearFormInputs = () => {
  inputDatas.value = {
    id: '',
    ad: '',
    soyad: '',
    yas: '',
    cinsiyet: ''
  };
}

onMounted(getService);
</script>
