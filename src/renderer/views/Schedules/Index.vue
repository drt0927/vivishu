<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>일정 관리</strong>
        <div class="card-header-actions">
          <CButton type="button" size="sm" color="primary" @click="addModal">추가</CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <calendar-view
          :show-date="today"
          :items="table.rows"
          :enableDragDrop="true"
          @click-date="dateClicked"
          @click-item="itemClicked"
          @drop-on-date="dropedItem"
          :periodChangedCallback="periodChanged"
          class="theme-default holiday-us-traditional holiday-us-official"
          style="height: 600px;">
          <template #header="{ headerProps }">
            <calendar-view-header
              :header-props="headerProps"
              @input="setShowDate" />
          </template>
        </calendar-view>
      </CCardBody>
    </CCard>

    <CModal :title="modal.title" :color="modal.class" :show.sync="modal.show">
      <CForm>
        <CInput
          description="제목을 입력해 주세요."
          label="제목 *"
          horizontal
          autocomplete="title"
          ref="title"
          v-model="modal.schedule.title"
          @keyup.enter="excute"
        />
        <date-picker
          :date.sync="modal.schedule.startDate"
          :attributes="datepicker.attributes"
          horizontal
          ref="startDate"
          mask="YYYY-MM-DD"
          placeholder="시작일을 선택해 주세요."
          label="시작일 *"
          @keyup.enter="excute"
        />
        <date-picker
          :date.sync="modal.schedule.endDate"
          :attributes="datepicker.attributes"
          horizontal
          ref="endDate"
          mask="YYYY-MM-DD"
          placeholder="종료일을 선택해 주세요."
          label="종료일"
          @keyup.enter="excute"
        />
        <CInput
          label="내용"
          horizontal
          ref="contents"
          v-model="modal.schedule.contents"
          @keyup.enter="excute"
        />
        <CRow form class="form-group">
          <CCol tag="label" sm="3" class="col-form-label">
            색상
          </CCol>
          <CCol sm="9">
            <div class="color-picker" style="background:#173F5F;" @click="selectColor('calendar-item-darkGreen')"></div>
            <div class="color-picker" style="background:#20639B;" @click="selectColor('calendar-item-darkBlue')"></div>
            <div class="color-picker" style="background:#3CAEA3;" @click="selectColor('calendar-item-blueGreen')"></div>
            <div class="color-picker" style="background:#F6D55C;" @click="selectColor('calendar-item-yellow')"></div>
            <div class="color-picker" style="background:#ED553B;" @click="selectColor('calendar-item-red')"></div>
            <div class="color-picker" style="background:#5B4DB7;" @click="selectColor('calendar-item-purple')"></div>
            <div class="color-picker" style="background:#81D152;" @click="selectColor('calendar-item-lime')"></div>
            <div class="color-picker" style="background:#FF9D4F;" @click="selectColor('calendar-item-orange')"></div>
          </CCol>
        </CRow>
      </CForm>
      <template #footer>
        <div style="width: 100%">
          <CButton type="submit" size="sm" color="secondary" @click="modal.show = false">닫기</CButton>
          <CButton type="button" size="sm" color="primary" class="float-right" @click="excute">{{modal.schedule._id ? '수정' : '추가'}}</CButton>
          <CButton type="button" v-show="modal.schedule._id ? true : false" size="sm" color="danger" @click="remove">삭제</CButton>
        </div>
      </template>
    </CModal>
  </div>
</template>

<script>
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar'
import DatePicker from '../../components/Controls/DatePicker.vue'

export default {
  name: 'schedules',
  data () {
    return {
      today: new Date(),
      table: {
        rows: [],
        fields: [],
        currentPage: 1,
        perPage: 999,
        totalPages: 0,
        search: {
          startDate: null,
          endDate: null,
          getQuery () {
            let query = {
              startDate: !this.startDate ? '' : { $lte: this.startDate },
              endDate: !this.endDate ? '' : { $gte: this.endDate }
            }

            return query
          }
        }
      },
      datepicker: {
        attributes: [
          {
            highlight: {
              color: 'purple',
              fillMode: 'outline'
            },
            dates: new Date()
          }
        ]
      },
      modal: {
        show: false,
        title: '일정 정보',
        class: '',
        type: 0,
        schedule: this.$db.schedules.getDocument()
      }
    }
  },
  components: {
    CalendarView,
    CalendarViewHeader,
    DatePicker
  },
  methods: {
    setShowDate (d) {
      this.today = d
    },
    dateClicked (date) { // items, event
      this.modal.schedule = this.$db.schedules.getDocument()
      this.modal.schedule.startDate = date
      this.modal.schedule.endDate = date
      this.modal.class = ''
      this.modal.show = true
      this.modal.type = 1 // 추가
      this.modal.title = '일정 추가'
    },
    itemClicked (item) { // event
      this.modal.schedule._id = item.originalItem._id
      this.modal.schedule.id = item.id
      this.modal.schedule.title = item.title
      this.modal.schedule.contents = item.originalItem.contents
      this.modal.schedule.startDate = item.startDate
      this.modal.schedule.endDate = item.endDate

      let itemClass = item.classes.filter(x => x.startsWith('calendar-item-'))
      this.modal.schedule.classes = itemClass.length > 0 ? itemClass[0] : ''
      this.modal.class = itemClass.length > 0 ? itemClass[0] : ''

      this.modal.show = true
      this.modal.type = 2 // 수정
      this.modal.title = '일정 수정'
    },
    selectColor (itemClasses) {
      this.modal.schedule.classes = itemClasses
      this.modal.class = itemClasses
    },
    async find () {
      await this.$db.schedules.findForTable(this.table)
    },
    async periodChanged (d) {
      this.table.search.startDate = d.displayLastDate
      this.table.search.endDate = d.displayFirstDate

      await this.find()
    },
    addModal () {
      this.dateClicked(new Date())
    },
    async dropedItem (item, date, event) {
      let newStartDate = this.$moment(date).startOf('day')._d
      let originStartDate = this.$moment(item.startDate).startOf('day')._d
      let originEndDate = item.originalItem.endDate ? this.$moment(item.endDate).startOf('day')._d : null
      let term = this.$moment(newStartDate).diff(this.$moment(originStartDate), 'days')
      let newEndDate = originEndDate ? this.$moment(originEndDate).add(term, 'd')._d : null

      this.modal.schedule._id = item.originalItem._id
      this.modal.schedule.id = item.id
      this.modal.schedule.title = item.title
      this.modal.schedule.contents = item.originalItem.contents
      this.modal.schedule.startDate = newStartDate
      this.modal.schedule.endDate = newEndDate

      let itemClass = item.classes.filter(x => x.startsWith('calendar-item-'))
      this.modal.schedule.classes = itemClass.length > 0 ? itemClass[0] : ''
      this.modal.class = itemClass.length > 0 ? itemClass[0] : ''
      this.modal.type = 2 // 수정

      await this.excute()
    },
    async excute () {
      if (!this.valid()) {
        return
      }

      if (this.modal.type === 1) {
        // 추가
        let add = await this.$db.schedules.add(this.modal.schedule)
        if (!add.isSuccess) {
          console.log(add.result)
          alert('일정 정보 추가를 실패하였습니다.')
          return
        }
      } else if (this.modal.type === 2) {
        // 수정
        let update = await this.$db.schedules.update(this.modal.schedule)
        if (!update.isSuccess) {
          alert('일정 정보 수정을 실패하였습니다.')
          return
        }
      }

      await this.find()
      this.modal.show = false
      this.$utils.sweetAlert.showToast(this, (this.modal.type === 1 ? '일정 정보 추가 완료' : '일정 정보 수정 완료'), 'success')
    },
    async remove () {
      if (confirm('삭제하시겠습니까?')) {
        let remove = await this.$db.schedules.remove(this.modal.schedule._id)
        if (!remove.isSuccess) {
          alert('일정 정보를 삭제하지 못했습니다.')
          return
        }

        await this.find()
        this.modal.show = false
        this.$utils.sweetAlert.showToast(this, '일정 정보 삭제 완료', 'success')
      }
    },
    valid () {
      if (!this.modal.schedule.title) {
        alert(`[제목]은(는) 필수 값 입니다.`)
        this.$utils.common.getElement(this, 'title').focus()
        return false
      }

      if (!this.modal.schedule.startDate) {
        alert(`[시작일]은(는) 필수 값 입니다.`)
        this.$utils.common.getElement(this, 'startDate').focus()
        return false
      }

      if (!this.modal.schedule.endDate) {
        this.modal.schedule.endDate = this.modal.schedule.startDate
      }

      return true
    }
  }
}
</script>

<style lang='scss'>
// @import "~vue-simple-calendar/dist/style.css";
// The next two lines are optional themes
@import "~vue-simple-calendar/static/css/default.css";
@import "~vue-simple-calendar/static/css/holidays-us.css";

.color-picker {
  width: 30px;
  height: 20px;
  display: inline-block;
  cursor: pointer;
}
.calendar-item-darkGreen {
  background-color: #173F5F !important;
  color: white;
}
.modal-calendar-item-darkGreen .modal-header {
  background-color: #173F5F !important;
  color: white;
}
.calendar-item-darkBlue {
  background-color: #20639B !important;
  color: white;
}
.modal-calendar-item-darkBlue .modal-header {
  background-color: #20639B !important;
  color: white;
}
.calendar-item-blueGreen {
  background-color: #3CAEA3 !important;
  color: white;
}
.modal-calendar-item-blueGreen .modal-header {
  background-color: #3CAEA3 !important;
  color: white;
}
.calendar-item-yellow {
  background-color: #F6D55C !important;
  color: black;
}
.modal-calendar-item-yellow .modal-header {
  background-color: #F6D55C !important;
  color: black;
}
.calendar-item-red {
  background-color: #ED553B !important;
  color: white;
}
.modal-calendar-item-red .modal-header {
  background-color: #ED553B !important;
  color: white;
}
.calendar-item-purple {
  background-color: #5B4DB7 !important;
  color: white;
}
.modal-calendar-item-purple .modal-header {
  background-color: #5B4DB7 !important;
  color: white;
}
.calendar-item-lime {
  background-color: #81D152 !important;
  color: black;
}
.modal-calendar-item-lime .modal-header {
  background-color: #81D152 !important;
  color: black;
}
.calendar-item-orange {
  background-color: #FF9D4F !important;
  color: black;
}
.modal-calendar-item-orange .modal-header {
  background-color: #FF9D4F !important;
  color: black;
}
</style>