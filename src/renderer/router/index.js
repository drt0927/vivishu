import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: require('@/containers/Container').default,
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: require('@/views/Dashboard').default
        },
        // #region 고객
        {
          path: '/customers',
          redirect: '/customers',
          name: '고객',
          component: require('@/views/Customers/Customers').default,
          children: [
            {
              path: '/customers',
              name: '고객 목록',
              component: require('@/views/Customers/Index').default
            },
            {
              path: '/customers/write',
              name: '고객 생성',
              component: require('@/views/Customers/Write').default
            },
            {
              path: '/customers/write/:id',
              name: '고객 수정',
              component: require('@/views/Customers/Write').default
            },
            {
              path: '/customers/:id',
              name: '고객 상세',
              component: require('@/views/Customers/Detail').default
            }
          ]
        },
        // #endregion
        {
          path: '/stores',
          name: '지점',
          component: require('@/views/Stores').default
        },
        {
          path: '/schedules',
          name: '일정',
          component: require('@/views/Schedules').default
        },
        {
          path: '/todos',
          name: 'Todo',
          component: require('@/views/Todos').default
        },
        {
          path: '/orders',
          name: '주문장',
          component: require('@/views/Orders').default
        },
        {
          path: '/trades',
          name: '수평이동',
          component: require('@/views/Trades').default
        }
      ]
      // component: require('@/components/Layouts/Default').default
      // children: [
      //   {
      //     path: '/',
      //     name: 'dashboard',
      //     component: require('@/components/Views/Dashboard').default
      //   },
      //   {
      //     path: '/board',
      //     name: 'board',
      //     component: require('@/components/Views/Board').default
      //   }
      // ]
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/views/Accounts/Login').default
    },
    {
      path: '/register',
      name: 'register',
      component: require('@/views/Accounts/Register').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
