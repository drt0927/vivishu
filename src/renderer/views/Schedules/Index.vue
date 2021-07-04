<template>
  <div>
    <CCard>
      <CCardBody>
        <calendar-view
          :show-date="showDate"
          class="theme-default holiday-us-traditional holiday-us-official">
          <template #header="{ headerProps }">
            <calendar-view-header
              :header-props="headerProps"
              @input="setShowDate" />
          </template>
        </calendar-view>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar'

export default {
  name: 'schedules',
  data () {
    return {
      showDate: new Date()
    }
  },
  components: {
    CalendarView,
    CalendarViewHeader
  },
  methods: {
    setShowDate (d) {
      this.showDate = d
    }
  }
}
</script>

<style lang='scss'>
// @import "~vue-simple-calendar/dist/style.css";
// The next two lines are optional themes
@import "~vue-simple-calendar/static/css/default.css";
@import "~vue-simple-calendar/static/css/holidays-us.css";
</style>