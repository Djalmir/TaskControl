import axios from 'axios'
import store from '../store/store'

const Axios = axios.create({
	// baseURL: 'http://192.168.100.100:3333',
	baseURL: 'https://razion-apis.herokuapp.com/',
	withCredentials: false,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
})

const configs = () => {
	return {
		headers: {
			user_id: store.state.session.user._id //  VERIFICAR ESSA LINHA COM ATENÇÃO
		}
	}
}

Axios.interceptors.request.use((config) => {
	//console.log('iniciou chamada')
	store.dispatch('setLoading', true)
	return config
}, (error) => {
	store.dispatch('setLoading', false)
	console.log('Erro: ', error.response.data.error)
	//alert('Erro: '+ error.response.data.error)
	store.dispatch('showMessage',{title:'Erro', msg:error.response.data.error})
	return Promise.reject(error)
})

Axios.interceptors.response.use((res) => {
	// console.log('Retorno: ', res)
	store.dispatch('setLoading', false)
	return res
}, (error) => {
	store.dispatch('setLoading', false)
	console.log('Erro: ', error.response.data.error)
	//alert('Erro: '+ error.response.data.error)
	store.dispatch('showMessage',{title:'Erro', msg:error.response.data.error})
	return Promise.reject(error)
})

export default {
	signUp(user) {
		return Axios.post(`/session/signup`, user)
	},
	login(user) {
		return Axios.post(`/session/login`, user)
	},

	getLists() {
		return Axios.get(`/list/listAll`, configs())
	},
	getListById(id) {
		return Axios.get(`/list/listOne/${ id }`, configs())
	},
	postList(name) {
		return Axios.post('/list/create', {name}, configs())
	},
	putList(infos) {
		// console.log('infos: ',infos)
		return Axios.put(`/list/update/${ infos._id }`, infos, configs())
	},
	deleteList(id) {
		return Axios.delete(`/list/delete/${ id }`, configs())
	}
}