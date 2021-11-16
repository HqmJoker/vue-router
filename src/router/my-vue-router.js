let Vue;

class VueRouter {
  constructor(options) {

    // 保存路由映射表
    this.$routes = options.routes;

    const initCurrent = window.location.hash.slice(1) || '/'; // 初始化this.current
    Vue.util.defineReactive(this, 'current', initCurrent); // 此处使用defineReactive函数把current属性变成响应式属性

    // 添加全局导航栏hash值变化
    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1) || '/';
    })
  }
}

// 传入的Vue实例对象
VueRouter.install = function(_Vue) {
  Vue = _Vue; // 保存Vue实例，构造函数使用
  
  // 混入模式把路由映射表挂载到Vue全局对象中
  Vue.mixin({
    beforeCreate() { // 钩子在每个组件创建实例时都会调用
      if(this.$options.router) { // 根实例才有该选项，此处为了避免重复挂载，只需要根实例挂载一次即可
        Vue.prototype.$router = this.$options.router;
      }
    }
  })

  // 全局注册router-link组件
  Vue.component('router-link', {
    name: 'router-link',
    props: {
      to: {
        type: String,
        required: true
      }
    },
    render(h) {
      return h(
        'a',         
        {
          attrs: {
            href: '#' + this.to
          }
        },
        this.$slots.default
      )
    }
  })

  // 全局注册router-view组件
  Vue.component('router-view', {
    name: 'router-view',
    render(h) {
      // 此处需要根据当前路由找到路由映射表对应的组件
      const comp = this.$router.$routes.find(item => item.path === this.$router.current);
      let component = null;
      if(comp) {
        component = comp.component
      }
      return h(component);
    }
  })

}

export default VueRouter