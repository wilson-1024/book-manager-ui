import Vue from 'vue'
import Router from 'vue-router'
import db from "../utils/sessionStorage"
import {getRequest} from "../utils/request"
Vue.use(Router)

// 静态路由
const login = r => require.ensure([], () => r(require('@/pages/login')), 'login');
const home = r => require.ensure([], () => r(require('@/pages/home')), 'home');
const userinfo = r => require.ensure([], () => r(require('@/pages/user/info')), 'userinfo');
const pwd = r => require.ensure([], () => r(require('@/pages/user/password')), 'pwd');
// const menus = r => require.ensure([], () => r(require('@/pages/org/permission-list')), 'menus');
// const addMenu = r =>require.ensure([], () => r(require('@/pages/org/permission-add')), 'addmenus')

const constRouter = [
	{
		path: '/',
		name: '登录页',
		component: login,
		hidden: true
	}
]

// 动态路由主页
const dynamicRouter = [
	{
		path: '/home',
		name: '主页',
		component: home,
		hidden: true,
		children:[
			{
				path: '/userinfo',
				name: '个人中心',
				component: userinfo,
				hidden: false ,
				meta:[
					{"name":"个人中心","path":""}
				]
			},
			{
				path: '/pwd',
				name: '修改密码',
				component: pwd,
				hidden: false ,
				meta:[
					{"name":"个人中心","path":"/userinfo"},{"name":"修改密码","path":""}
				]
			},
			// {
			// 	path: '/org/permission-list',
			// 	name: '菜单权限',
			// 	component: menus,
			// 	hidden: false ,
			// 	meta:[
			// 		{"name":"个人中心","path":"/userinfo"},{"name":"修改密码","path":""}
			// 	]
			// },
			// {
			// 	path: '/org/permission-add',
			// 	name: '添加菜单',
			// 	component: addMenu,
			// 	hidden: false ,
			// 	meta:[
			// 		{"name":"个人中心","path":"/userinfo"},{"name":"修改密码","path":""}
			// 	]
			// }
		]
	}
]

let router = new Router({
	routes: constRouter
})

// 导航守卫，处理动态路由
let asyncRouter
// router.addRoutes(dynamicRouter)
router.beforeEach((to, from, next) => {
	window.console.log("beforeEach");
	window.console.log(router);
	window.console.log(to);
	window.console.log(from);
	let user = db.get("USER")
	let userRouter = db.get('USER_ROUTER')
	window.console.log(user);
	window.console.log(asyncRouter);
	let token = db.get("token");
	if(!token){
		asyncRouter='';
	}
	if(!token && to.path!='/'){
		router.replace("/")
		return;
	}else if(token && to.path == '/'){
		next({path:"/home"})
		return;
	}else {
		// next()
	}
	if(user && user.id){
		if (!asyncRouter || asyncRouter=='') {
			if (!userRouter || userRouter=='' || userRouter==null) {
				getRequest( "/ms-book-user-manager/api/permission/getUserRouter" , {}).then(resp => {


					if (resp && !resp.status) {
						asyncRouter = resp
						if(resp.length>0){
							db.save('USER_ROUTER', resp)
							loadAsyncRouter(to, next)
						}
					}
				})
			} else {
				asyncRouter = userRouter
				loadAsyncRouter(to, next)
			}
		} else {
			next()
		}
	} else {
		next()
	}
})

// 载入异步路由
function loadAsyncRouter (to, next) {
	if(asyncRouter.length > 0){
		asyncRouter = filterAsyncRouter(asyncRouter)
		dynamicRouter.find(v => v.path === '/home').children.push(...asyncRouter)
		router.addRoutes(dynamicRouter)
	}
	next({...to, replace: true})
}

// 过滤路由
function filterAsyncRouter(routes){
	return routes.filter((route) => {
		route.component = resolveComponent(route.component)
		return true
	})
}

// 解析组件
function resolveComponent (path) {

	return function (resolve) {
		import(`@/pages/${path}.vue`).then(mod => {
			resolve(mod)
		})
	}
}

export default router