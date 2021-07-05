<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>일정 관리</strong>
        <div class="card-header-actions">
          <CButton type="button" size="sm" color="primary" @click="add">추가</CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <calendar-view
          :show-date="calendar.today"
          :items="calendar.list.rows"
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
          horizontal
          ref="startDate"
          mask="YYYY-MM-DD"
          placeholder="시작일을 선택해 주세요."
          label="시작일 *"
          @keyup.enter="excute"
        />
        <date-picker
          :date.sync="modal.schedule.endDate"
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
            <div class="color-picker" style="background:#5B4DB7;" @click="selectColor('calendar-item-puple')"></div>
            <div class="color-picker" style="background:#81D152;" @click="selectColor('calendar-item-lime')"></div>
            <div class="color-picker" style="background:#FF9D4F;" @click="selectColor('calendar-item-orange')"></div>
          </CCol>
        </CRow>
      </CForm>
      <template #footer>
        <div style="width: 100%">
          <CButton type="button" size="sm" color="primary" class="float-left" @click="excute">{{modal.schedule._id ? '수정' : '추가'}}</CButton>
          <CButton type="submit" size="sm" color="secondary" class="float-right" @click="modal.show = false">닫기</CButton>
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
      calendar: {
        today: new Date(),
        list: {
          rows: [],
          fields: [],
          currentPage: 1,
          perPage: 999,
          totalPages: 0
        },
        search: {
          startDate: {
            operator: this.$utils.enums.NedbQueryOperators.LessThanEqual,
            value: null
          },
          endDate: {
            operator: this.$utils.enums.NedbQueryOperators.GraterThanEqual,
            value: null
          }
        }
      },
      modal: {
        show: false,
        title: '일정 정보',
        class: '',
        type: 0,
        schedule: this.$db.schedules.getNewDocument()
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
      this.calendar.today = d
    },
    dateClicked (date) { // items, event
      this.modal.schedule = this.$db.schedules.getNewDocument()
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
      this.modal.schedule.classes = item.classes
      this.modal.class = item.originalItem.classes
      this.modal.show = true
      this.modal.type = 2 // 수정
      this.modal.title = '일정 수정'
    },
    selectColor (itemClasses) {
      this.modal.schedule.classes = itemClasses
      this.modal.class = itemClasses
    },
    async find () {
      let db = this.$db.schedules
      await db.find(
        this.calendar.search
        , { id: -1 }
        , this.calendar.list)
    },
    async periodChanged (d) {
      this.calendar.search.startDate.value = d.displayLastDate
      this.calendar.search.endDate.value = d.displayFirstDate

      await this.find()
    },
    add () {
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
      if (!this.$db.schedules.valid(this, this.modal.schedule)) {
        return
      }

      if (this.modal.type === 1) {
        // 추가
        let insert = await this.$db.schedules.insert(this.modal.schedule) // insert
        if (!insert.isSuccess) {
          console.log(insert.result)
          alert('일정 정보 추가를 실패하였습니다.')
          return
        }
      } else if (this.modal.type === 2) {
        // 수정
        let update = await this.$db.schedules.update(this.modal.schedule._id, this.modal.schedule)
        if (!update.isSuccess) {
          alert('일정 정보 수정을 실패하였습니다.')
          return
        }
      }

      await this.find()
      this.modal.show = false
      this.$swal({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        icon: 'success',
        title: this.modal.type === 1 ? '일정 정보 추가 완료' : '일정 정보 수정 완료'
      })
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
.calendar-item-puple {
  background-color: #5B4DB7 !important;
  color: white;
}
.modal-calendar-item-puple .modal-header {
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