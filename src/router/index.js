import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../views/index.vue'
import CreateUser from '../views/User/CreateUser.vue'
import UserList from '../views/User/UserList.vue'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
    { path: '/', name: 'index', component: index, 
    children: [
      { path: '/createuser', name: '新建用户', component: CreateUser },
      { path: '/edituser/:id', name: '编辑用户', component: CreateUser },
      { path: '/userlist', name: '用户列表', component: UserList },
    ]},
]

const router = new VueRouter({
  routes
})

export default router