import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'default',
      component: require('@/containers/Container').default,
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: require('@/views/Dashboard').default
        },
        {
          path: '/customers',
          name: 'customers',
          component: require('@/views/Customers').default
        },
        {
          path: '/stores',
          name: 'stores',
          component: require('@/views/Stores').default
        },
        {
          path: '/schedules',
          name: 'schedules',
          component: require('@/views/Schedules').default
        },
        {
          path: '/todos',
          name: 'todos',
          component: require('@/views/Todos').default
        },
        {
          path: '/orders',
          name: 'orders',
          component: require('@/views/Orders').default
        },
        {
          path: '/trades',
          name: 'trades',
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
      component: require('@/views/Login').default
    },
    {
      path: '/register',
      name: 'register',
      component: require('@/views/Register').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
