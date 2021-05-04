<<<<<<< HEAD
import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:3000',
	withCredentials: false,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
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
=======
import axios from 'axios'

const api = axios.create({
	baseURL: 'http://192.168.100.100:3000',
	withCredentials: false,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
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
>>>>>>> 0428fe12c29612fb319cbdf6deb4efbbc0e0f9f1
