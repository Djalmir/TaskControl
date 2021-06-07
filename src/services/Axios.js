import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:3000',
	withCredentials: false,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
})

api.interceptors.request.use((config)=>{
	console.log('iniciou chamada')
	return config
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