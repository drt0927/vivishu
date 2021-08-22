export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-chart-pie'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['고객 관리']
      },
      {
        _name: 'CSidebarNavItem',
        name: '고객',
        to: '/customers',
        icon: 'cil-people'
      },
      {
        _name: 'CSidebarNavItem',
        name: '주문장',
        to: '/orders',
        icon: 'cil-cart'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['매장 관리']
      },
      {
        _name: 'CSidebarNavItem',
        name: '지점',
        to: '/stores',
        icon: 'cil-home'
      },
      {
        _name: 'CSidebarNavItem',
        name: '일정',
        to: '/schedules',
        icon: 'cil-calendar'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Todo',
        to: '/todos',
        icon: 'cil-list'
      },
      {
        _name: 'CSidebarNavItem',
        name: '일매출',
        to: '/sales',
        icon: 'cil-money',
        type: 99
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['비용 관리'],
        type: 99
      },
      {
        _name: 'CSidebarNavItem',
        name: '지출',
        to: '/expense',
        icon: 'cil-wallet',
        type: 99
      },
      {
        _name: 'CSidebarNavItem',
        name: '코드',
        to: '/codes',
        icon: 'cil-code',
        type: 99
      }
    ]
  }
]
