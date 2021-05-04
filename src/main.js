import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router/router'
import store from './store/store'
import BaseAddButton from './components/BaseAddButton'

Vue.component('BaseAddButton', BaseAddButton)

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
