<template>
  <v-app>
    <v-main>

      <cp-toolbar v-bind:toolbarTitle="toolbarTitle"></cp-toolbar>

      <v-data-table-server v-model:items-per-page="itemsPerPage" :items-per-page-options="itemsPerPageOptions"
        :headers="headers" :items="serverItems" :items-length="totalItems" :loading="loading" :search="search"
        item-value="id" @update:options="loadItems">
        <template v-slot:item="{ item }">
          <tr>
            <td class="text-center">{{ item.id }}</td>
            <td class="text-center">{{ item.ad }}</td>
            <td class="text-center">{{ item.soyad }}</td>
            <td class="text-center">{{ item.yas }}</td>
            <td class="text-center">{{ item.cinsiyet }}</td>
            <td class="text-center">
              <v-icon @click="DeleteItem(item.id)">mdi-delete</v-icon>
            </td>
            <td class="text-center">
              <v-icon @click="ViewItem(item.id, true)">mdi-pencil</v-icon>
            </td>
            <td class="text-center">
              <v-icon @click="ViewItem(item.id, false)">mdi-dialpad</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table-server>

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
                  <v-autocomplete :items="['Kadın', 'Erkek']" label="Cinsiyet" auto-select-first
                    v-model="inputDatas.cinsiyet"></v-autocomplete>
                </v-col>
              </v-row>

              <small class="text-caption text-medium-emphasis">*Zorunlu alan</small>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text="Kapat" variant="plain" @click="DialogKapat"></v-btn>

              <v-btn v-show="isSaveButtonVisible" color="primary" text="Kaydet" variant="tonal"
                @click="submitForm"></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <CpLocalFooter></CpLocalFooter>

    </v-main>
  </v-app>

</template>

<script setup>
import { ref, onMounted, computed, toRaw } from 'vue';
import axios from 'axios';
import { shallowRef } from 'vue';
import CpLocalFooter from '@/components/CpLocalFooter.vue';

const toolbarTitle = ref("App.vue'dan Beslenen Toolbar Başlığı");
const inputDatas = ref({})
const dialog = shallowRef(false)
const isSaveButtonVisible = ref(true)
const itemsPerPage = ref(10)
const search = ref('')
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0);
const currentPage = ref(1);

const itemsPerPageOptions = computed(() => {
  const options = []
  for (let i = 10; i <= totalItems.value + 10; i += 10) {
    options.push(i)
  }
  return options
})
const headers = ref([
  { title: 'Id', key: 'id', align: 'center', sortable: true },
  { title: 'Ad', key: 'ad', align: 'center' },
  { title: 'Soyad', key: 'soyad', align: 'center' },
  { title: 'Yaş', key: 'yas', align: 'center' },
  { title: 'Cinsiyet', key: 'cinsiyet', align: 'center' },
  { title: 'Sil', key: 'sil', align: 'center', sortable: false },
  { title: 'Güncelle', key: 'edit', align: 'center', sortable: false },
  { title: 'Görüntüle', key: 'view', align: 'center', sortable: false },
])

function loadItems(options) {
  loading.value = true;
  const { page, itemsPerPage } = options;
  const skip = (page - 1) * itemsPerPage;
  const rawSortBy = toRaw(options.sortBy);
  const sort = rawSortBy.length ? rawSortBy[0] : null;

  GetPagingService(itemsPerPage, skip, sort).then(({ items, total }) => {
    serverItems.value = items;
    totalItems.value = total;
    loading.value = false;

    // Mevcut sayfa numarasını güncelle
    currentPage.value = page;
    // Toplam öğe sayısını güncelle
    totalItems.value = total;
  });
}

const GetPagingService = (limit, skip, sort = null) => {
  const params = { limit, skip };

  if (sort) {
    params.sort = sort.key;
    params.sortDirection = sort.order;
  }

  return axios.get('https://localhost:44322/api/ZK/Paging', { params })
    .then(response => {
      const { diziKayitlar, total } = response.data;
      return { items: diziKayitlar, total };
    })
    .catch(error => {
      console.error('Get Hata Mesajı:', error);
      return { items: [], total: 0 };
    });
};

const ViewItem = (id, isVisibleButton) => {
  clearFormInputs();
  axios.get(`https://localhost:44322/api/ZK/${id}`)
    .then(response => {
      isSaveButtonVisible.value = isVisibleButton;
      inputDatas.value = response.data;
      dialog.value = true;
    })
    .catch(error => {
      console.error('Kayıt görüntülenirken hata oluştu:', error);
    });
}

const DeleteItem = (id) => {
  axios.delete('https://localhost:44322/api/ZK/' + id)
    .then(response => {
      //tableItems.value = tableItems.value.filter(item => item.id !== id);
      loadItems({ page: currentPage.value, itemsPerPage: itemsPerPage.value, sortBy: [] });
    })
    .catch(error => {
      console.error('Kayıt silinirken hata oluştu:', error);
    });
}

const UpdateItem = (id) => {
  axios.put('https://localhost:44322/api/ZK/' + id, inputDatas.value)
    .then(response => {
      console.log('Öğe başarıyla güncellendi:', response.data);
      loadItems({ page: currentPage.value, itemsPerPage: itemsPerPage.value, sortBy: [] });
      dialog.value = false;
    })
    .catch(error => {
      console.error('Öğe güncellenirken hata oluştu:', error);
    });
}

const submitForm = () => {

  if (inputDatas.value.id == undefined) {
    axios.post('https://localhost:44322/api/ZK', inputDatas.value)
      .then(response => {
        console.log('Kayıt başarıyla eklendi:', response.data);
        dialog.value = false;
        loadItems({ page: currentPage.value, itemsPerPage: itemsPerPage.value, sortBy: [] });
      })
      .catch(error => {
        console.error('Kayıt eklenirken hata oluştu:', error);
      });

  }
  else {
    UpdateItem(inputDatas.value.id);
  }

  clearFormInputs();
}

const DialogKapat = () => {
  clearFormInputs();
  dialog.value = false;
  isSaveButtonVisible.value = true;
}

const clearFormInputs = () => {
  inputDatas.value = {};
}

onMounted(() => {
  loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
});

</script>
