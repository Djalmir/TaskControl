import axios from 'axios'
import store from '../store/store'

const Axios = axios.create({
	baseURL: 'http://localhost:3333',
	withCredentials: false,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
})

const configs = () => {
	return {
		headers: {
			userId: store.state.session.user._id //  VERIFICAR ESSA LINHA COM ATENÇÃO
		}
	}
}

Axios.interceptors.request.use((config) => {
	//console.log('iniciou chamada')
	store.dispatch('setLoading', true)
	return config
}, (error) => {
	store.dispatch('setLoading', false)
	console.log('Erro na chamada: ', error)
	return Promise.reject(error)
})

Axios.interceptors.response.use((res) => {
	console.log('Retorno: ', res)
	store.dispatch('setLoading', false)
	return res
}, (error) => {
	store.dispatch('setLoading', false)
	console.log('Erro no retorno: ', error)
	return Promise.reject(error)
})

export default {
	signUp(user){
		return Axios.post(`/user/create`, user)
	},
	login(user){
		return Axios.post(`/user/login`, user)
	},

	getLists() {
		return Axios.get(`/lists`, configs())
	},
	getListById(id) {
		return Axios.get(`/lists/${ id }`, configs())
	},
	postList(name) {
		return Axios.post('/lists', {
			name: name,
			todos: []
		}, configs())
	},
	putList(id, name, todos) {
		return Axios.put(`/lists/${ id }`, {
			name: name,
			todos: todos
		}, configs())
	},
	deleteList(id) {
		return Axios.delete(`/lists/${ id }`, configs())
	}
}