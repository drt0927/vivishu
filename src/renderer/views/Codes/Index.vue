<template>
  <div style="min-height:1000px;">
    <transition name="fade">
      <CCard>
        <CCardHeader>
          <strong>코드 관리 </strong> <small>목록</small>
          <div class="card-header-actions">
            <CLink class="card-header-action btn-minimize" @click="bind.isCollapsed = !bind.isCollapsed">
              <CIcon :name="`cil-chevron-${bind.isCollapsed ? 'bottom' : 'top'}`"/>
            </CLink>
          </div>
        </CCardHeader>
        <CCollapse :show="bind.isCollapsed" :duration="400">
          <CCardBody>
            <CRow>
              <CCol sm="6">
                <CInput
                  label="타입"
                  placeholder="타입을 입력해 주세요. [like]"
                  v-model="table.search.type"
                  @keyup.enter="find"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  label="이름"
                  placeholder="이름을 입력해 주세요. [like]"
                  v-model="table.search.name"
                  @keyup.enter="find"
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCollapse>
        <CCardFooter>
          <CButton type="button" size="sm" color="primary" @click="addModal">추가</CButton>
          <CButton type="submit" size="sm" color="success" class="float-right" @click="find">검색</CButton>
        </CCardFooter>
      </CCard>
    </transition>

    <CCard>
      <CDataTable
        :items="table.rows"
        :fields="table.fields"
        :items-per-page="table.perPage"
        hover
      >
        <template #color="{item}">
          <td :style="`vertical-align: middle; background: ${$utils.common.Hex8toRgba(item.color)};`">
            <span style="font-weight: bold;">
              {{item.color}}
            </span>
          </td>
        </template>
        <template #btnDetail="{item}">
          <td>
            <CButton
            color="primary"
            variant="outline"
            square
            size="sm"
            @click="editModal(item._id)"
          >
            상세
          </CButton>
          </td>
        </template>
      </CDataTable>
      
      <CPagination
        :activePage.sync="table.currentPage"
        :pages="table.totalPages"
        align="center"
      />
    </CCard>

    <CModal :title="modal.title" :show.sync="modal.show">
      <CForm>
        <CSelect
          description="타입을 입력해 주세요."
          label="타입 *"
          horizontal
          ref="type"
          :value.sync="modal.code.type"
          :options="bind.codeTypes"
          @keyup.enter="excute"
        />
        <CInput
          description="이름을 입력해 주세요."
          label="이름 *"
          horizontal
          autocomplete="name"
          ref="name"
          v-model="modal.code.name"
          @keyup.enter="excute"
        />
        <CInput
          description="코드를 입력해 주세요."
          label="코드 *"
          type="number"
          horizontal
          autocomplete="code"
          ref="code"
          v-model.number="modal.code.code"
          @keyup.enter="excute"
        />
        색상
        <Chrome v-model="modal.color" style="margin: 0 auto;"/>
      </CForm>
      <template #footer>
        <div style="width: 100%">
          <CButton type="button" size="sm" color="primary" @click="excute">{{modal.code._id ? '수정' : '추가'}}</CButton>
          <CButton type="button" v-show="modal.code._id ? true : false" size="sm" color="danger" @click="remove">삭제</CButton>
          <CButton type="submit" size="sm" color="secondary" class="float-right" @click="modal.show = false">닫기</CButton>
        </div>
      </template>
    </CModal>
  </div>
</template>

<script>
import { Chrome } from 'vue-color'

export default {
  name: 'codes',
  data () {
    return {
      bind: {
        isCollapsed: true,
        codeTypes: this.$db.codes.getCodeTypeList()
      },
      table: {
        rows: [],
        fields: [
          { key: 'type', label: '타입' },
          { key: 'name', label: '이름' },
          { key: 'code', label: '코드' },
          { key: 'color', label: '색상' },
          { key: 'btnDetail', label: '상세' }
        ],
        currentPage: 1,
        perPage: 15,
        totalPages: 0,
        sort: { type: -1, code: -1 },
        search: {
          type: '',
          name: '',
          getQuery () {
            return {
              type: !this.type ? '' : { $regex: new RegExp(this.type) },
              name: !this.name ? '' : { $regex: new RegExp(this.name) }
            }
          }
        }
      },
      modal: {
        show: false,
        title: '코드 정보',
        type: 0,
        code: this.$db.codes.getDocument(),
        color: ''
      }
    }
  },
  components: {
    Chrome
  },
  watch: {
    'table.currentPage': async function () {
      await this.find()
    }
  },
  methods: {
    async find () {
      await this.$db.codes.findForTable(this.table)
    },
    addModal () {
      this.modal.code = this.$db.codes.getDocument()
      this.modal.code.type = this.$db.codes.getCodeTypeList()[0].value
      this.modal.code.name = ''
      this.modal.code.code = ''
      this.modal.code.color = '#ffffff'
      this.modal.color = '#ffffff'
      this.modal.type = 1 // 추가
      this.modal.title = '코드 추가'
      this.modal.show = true
    },
    async editModal (id) {
      let find = await this.$db.codes.findOne(id)
      if (!find.isSuccess) {
        console.log(find.result)
        alert('코드 정보를 확인 할 수 없습니다.')
      }

      let item = find.result
      this.modal.code._id = item._id
      this.modal.code.type = item.type
      this.modal.code.name = item.name
      this.modal.code.code = item.code
      this.modal.code.color = item.color
      this.modal.color = item.color
      this.modal.type = 2 // 수정
      this.modal.title = '코드 수정'
      this.modal.show = true
    },
    async excute () {
      let isValid = await this.valid()
      if (!isValid) {
        return
      }

      if (typeof (this.modal.color) === 'string') {
        this.modal.code.color = this.modal.color
      } else {
        this.modal.code.color = this.modal.color.hex8
      }

      if (this.modal.type === 1) {
        // 추가
        let add = await this.$db.codes.add(this.modal.code)
        if (!add.isSuccess) {
          console.log(add.result)
          alert('코드 정보 추가를 실패하였습니다.')
          return
        }
      } else if (this.modal.type === 2) {
        // 수정
        let update = await this.$db.codes.update(this.modal.code)
        if (!update.isSuccess) {
          alert('코드 정보 수정을 실패하였습니다.')
          return
        }
      }

      await this.find()
      this.modal.show = false
      this.$utils.sweetAlert.showToast(this, (this.modal.type === 1 ? '코드 정보 추가 완료' : '코드 정보 수정 완료'), 'success')
    },
    async remove () {
      if (confirm('삭제하시겠습니까?')) {
        let remove = await this.$db.codes.remove(this.modal.code._id)
        if (!remove.isSuccess) {
          alert('code 정보를 삭제하지 못했습니다.')
          return
        }

        await this.find()
        this.modal.show = false
        this.$utils.sweetAlert.showToast(this, '코드 정보 삭제 완료', 'success')
      }
    },
    async valid () {
      if (!this.modal.code.type) {
        alert(`[타입]은(는) 필수 값 입니다.`)
        this.$utils.common.getElement(this, 'type').focus()
        return false
      }

      if (!this.modal.code.name) {
        alert(`[이름]은(는) 필수 값 입니다.`)
        this.$utils.common.getElement(this, 'name').focus()
        return false
      }

      if (!this.modal.code.code) {
        alert(`[코드]은(는) 필수 값 입니다.`)
        this.$utils.common.getElement(this, 'code').focus()
        return false
      }

      if (this.modal.type === 1) {
        let find = await this.$db.codes.findOneByQuery({
          type: this.modal.code.type,
          name: this.modal.code.name
        })

        if (find.isSuccess && find.result) {
          alert(`[${this.modal.code.type}]에 동일한 이름이 존재합니다.`)
          this.$utils.common.getElement(this, 'name').focus()
          return false
        }

        find = await this.$db.codes.findOneByQuery({
          type: this.modal.code.type,
          code: this.modal.code.code
        })

        if (find.isSuccess && find.result) {
          alert(`[${this.modal.code.type}]에 동일한 코드가 존재합니다.`)
          this.$utils.common.getElement(this, 'code').focus()
          return false
        }
      }

      return true
    }
  },
  async mounted () {
    await this.find()
  }
}
</script>

<style>

</style>