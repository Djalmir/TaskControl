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
	}
}
