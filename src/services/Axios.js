import axios from 'axios'
import store from '../store/store'

const api = axios.create({
	baseURL: 'http://localhost:3000',
	withCredentials: false,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
})

api.interceptors.request.use((config)=>{
	//console.log('iniciou chamada')
	store.dispatch('setLoading', true)
	return config
},(error)=>{
	store.dispatch('setLoading', false)
	console.log('Erro na chamada: ',error)
	return Promise.reject(error)
})

api.interceptors.response.use((res)=>{
	console.log('Retorno: ',res)
	store.dispatch('setLoading', false)
	return res
},(error)=>{
	store.dispatch('setLoading', false)
	console.log('Erro no retorno: ',error)
	return Promise.reject(error)
})

export default {
	getLists() {
		return api.get(`/lists`)
	},
	postList(name) {
		return api.post('/lists', {
			name: name,
			todos: []
		})
	},
	putList(id, name, todos) {
		return api.put(`/lists/${id}`, {
			name: name,
			todos: todos
		})
	},
	deleteList(id) {
		return api.delete(`/lists/${id}`)
	},
	getListById(id) {
		return api.get(`/lists/${id}`)
	}
}