<script lang="ts" setup>
import { computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useProject } from '@/store/pinia/project'
import Multiselect from '@vueform/multiselect'

const emit = defineEmits(['proj-select'])

const router = useRouter()

const projStore = useProject()
const project = computed(() => projStore.project?.pk)
const projSelectList = computed(() => projStore.projSelect)

const projSelect = (e: { originalEvent: Event; value: any; option: any }) => emit('proj-select', e)
const projClear = () => emit('proj-select', null)

onBeforeMount(() => {
  projStore.fetchProjectList()
  projStore.fetchProject(project.value || projStore.initProjId)
})
</script>

<template>
  <CRow class="m-0 align-items-center">
    <CFormLabel class="col-lg-1 col-form-label text-body">프로젝트</CFormLabel>
    <CCol md="6" lg="3">
      <Multiselect
        :value="project"
        :options="projSelectList"
        placeholder="프로젝트선택"
        autocomplete="label"
        :classes="{ search: 'form-control multiselect-search' }"
        :add-option-on="['enter', 'tab']"
        searchable
        @select="projSelect"
        @clear="projClear"
      />
    </CCol>
    <CCol v-if="!projSelectList.length" class="pl-0 align-middle">
      <v-icon
        icon="mdi mdi-plus-thick"
        color="success"
        @click="router.push({ name: '프로젝트 등록' })"
      />
    </CCol>
  </CRow>
</template>
