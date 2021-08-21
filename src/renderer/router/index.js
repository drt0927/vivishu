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
              name: '고객 추가',
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
          redirect: '/stores',
          name: '지점',
          component: require('@/views/Stores/Stores').default,
          children: [
            {
              path: '/stores',
              name: '지점 목록',
              component: require('@/views/Stores/Index').default
            },
            {
              path: '/stores/write',
              name: '지점 추가',
              component: require('@/views/Stores/Write').default
            },
            {
              path: '/stores/write/:id',
              name: '지점 수정',
              component: require('@/views/Stores/Write').default
            },
            {
              path: '/stores/:id',
              name: '지점 상세',
              component: require('@/views/Stores/Detail').default
            }
          ]
        },
        {
          path: '/schedules',
          redirect: '/schedules',
          name: '일정',
          component: require('@/views/Schedules/Schedules').default,
          children: [
            {
              path: '/schedules',
              name: '일정 목록',
              component: require('@/views/Schedules/Index').default
            }
          ]
        },
        {
          path: '/todos',
          redirect: '/todos',
          name: 'Todo',
          component: require('@/views/Todos/Todos').default,
          children: [
            {
              path: '/todos',
              name: 'Todo 목록',
              component: require('@/views/Todos/Index').default
            }
          ]
        },
        {
          path: '/orders',
          redirect: '/orders',
          name: '주문장',
          component: require('@/views/Orders/Orders').default,
          children: [
            {
              path: '/orders',
              name: '주문장 목록',
              component: require('@/views/Orders/Index').default
            },
            {
              path: '/orders/write',
              name: '주문장 추가',
              component: require('@/views/Orders/Write').default
            },
            {
              path: '/orders/write/:id',
              name: '주문장 수정',
              component: require('@/views/Orders/Write').default
            },
            {
              path: '/orders/:id',
              name: '주문장 상세',
              component: require('@/views/Orders/Detail').default
            }
          ]
        },
        {
          path: '/trades',
          redirect: '/trades',
          name: '수평이동',
          component: require('@/views/Trades/Trades').default,
          children: [
            {
              path: '/trades',
              name: '수평이동 목록',
              component: require('@/views/Trades/Index').default
            },
            {
              path: '/trades/write',
              name: '수평이동 추가',
              component: require('@/views/Trades/Write').default
            },
            {
              path: '/trades/edit/:id',
              name: '수평이동 수정',
              component: require('@/views/Trades/Edit').default
            },
            {
              path: '/trades/:id',
              name: '수평이동 상세',
              component: require('@/views/Trades/Detail').default
            }
          ]
        },
        {
          path: '/sales',
          redirect: '/sales',
          name: '일매출',
          component: require('@/views/Sales/Sales').default,
          children: [
            {
              path: '/sales',
              name: '일매출 목록',
              component: require('@/views/Sales/Index').default
            },
            {
              path: '/sales/write',
              name: '일매출 추가',
              component: require('@/views/Sales/Write').default
            },
            {
              path: '/sales/write/:id',
              name: '일매출 수정',
              component: require('@/views/Sales/Write').default
            },
            {
              path: '/sales/:id',
              name: '일매출 상세',
              component: require('@/views/Sales/Detail').default
            }
          ]
        },
        {
          path: '/expense',
          redirect: '/expense',
          name: '지출',
          component: require('@/views/Expense/Expense').default,
          children: [
            {
              path: '/expense',
              name: '지출 목록',
              component: require('@/views/Expense/Index').default
            },
            {
              path: '/expense/write',
              name: '지출 추가',
              component: require('@/views/expense/Write').default
            },
            {
              path: '/expense/write/:id',
              name: '지출 수정',
              component: require('@/views/expense/Write').default
            },
            {
              path: '/expense/:id',
              name: '지출 상세',
              component: require('@/views/expense/Detail').default
            }
          ]
        },
        {
          path: '/codes',
          redirect: '/codes',
          name: '코드',
          component: require('@/views/Codes/Codes').default,
          children: [
            {
              path: '/codes',
              name: '코드 목록',
              component: require('@/views/Codes/Index').default
            }
          ]
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
