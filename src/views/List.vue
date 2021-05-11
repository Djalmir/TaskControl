<template>
	<div>
		<BaseAddButton @add="addTodo" />
		<div id="list">
			<div v-for="(todo, index) in list.todos" :key="index" class="todoContainer">
				<div class="todo" :class="{ done: todo.done }" @click="setTodoDone(todo)" @contextmenu.prevent="(e) => {
							if (e.target.tagName != 'INPUT') subMenu(todo.id)
							else e.target.select()
						}
					">
					<img :src="require('../assets/done.svg')" :style="todo.done ? 'opacity:1' : 'opacity:0'" />
					<span v-if="renaming != todo.id">{{ todo.name }}</span>
					<input type="text" placeholder="Nome" :id="'nameInput' + todo.id" :value="todo.name" class="nameInput" v-if="renaming === todo.id" autocomplete="off" @keypress.enter="renameOrSave(todo)" @keydown.esc="delOrCancel(todo)" />
				</div>
				<SubMenu :item="todo" @delOrCancel="delOrCancel" @renameOrSave="renameOrSave" />
			</div>
		</div>
	</div>
</template>

<script>
import Axios from '../services/Axios'
import SubMenu from '../components/SubMenu'
import {mapState} from 'vuex'
export default {
	props: {
		list: {
			type: Object,
			required: true
		}
	},
	components: {
		SubMenu
	},
	computed: {
		...mapState(['showingSubMenu', 'renaming'])
	},
	beforeRouteUpdate(to, from, next) {
		this.$store.dispatch('list/setList', to.params.id).then(list => {
			to.params.list = list
			next()
		})
	},
	mounted(){
		console.log(this.list.name)
	},
	methods: {
		addTodo(name) {
			let todo = {
				id: 1 + Math.floor(Math.random() * 9999999),
				name: name,
				done: false
			}
			while (this.list.todos.find(t => t.id == todo.id))
				todo.id = 1 + Math.floor(Math.random() * 9999999)
			let todos = [...this.list.todos, todo]
			Axios.putList(this.list.id, this.list.name, todos)
				.then(() => {
					this.$store.dispatch('list/setTodos', todos)
					window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})
				})
				.catch(err => {
					console.log(err.response)
				})
		},
		setTodoDone(todo) {
			todo.done = !todo.done
			Axios.putList(this.list.id, this.list.name, this.list.todos)
				.then(() => {
					this.$store.dispatch('list/setTodos', this.list.todos)
				})
				.catch(err => {
					console.log(err.response)
				})
		},
		subMenu(id) {
			this.$store.dispatch('setRenaming', null)
			this.$store.dispatch('setShowingSubMenu', id)
		},
		delOrCancel(todo) {
			if (this.renaming)
				this.$store.dispatch('setRenaming', null)
			else {
				if (confirm(`Remover ${ todo.name }?`)) {
					let todos = this.list.todos.filter(t => t.id !== todo.id)
					Axios.putList(this.list.id, this.list.name, todos)
						.then(() => {
							this.list.todos = todos
							this.store.dispatch('list/setTodos', todos)
						})
						.catch((err) => {
							console.log(err.response)
						})
				}
			}
		},
		renameOrSave(todo) {
			if (this.renaming) {
				let input = document.querySelector(`#nameInput${ todo.id }`)
				if (input.value.trim() != '') {
					this.list.todos.find(t => t.id == todo.id).name = input.value
					return Axios.putList(this.list.id, this.list.name, this.list.todos)
						.then(() => {
							todo.name = input.value
							this.$store.dispatch('list/setLists', this.list.lists)
							this.$store.dispatch('setRenaming', null)
							this.$store.dispatch('setShowingSubMenu', null)
						})
						.catch(err => {
							console.log(err)
						})
				}
				else
					input.focus()
			}
			else {
				this.$store.dispatch('setRenaming', todo.id)
				setTimeout(() => {
					let input = document.querySelector(`#nameInput${ todo.id }`)
					input.focus()
				}, 200)
			}
		}
	}
}
</script>

<style scoped>
#list {
	margin: 60px auto;
	padding: 20px 0;
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
}

.todoContainer {
	width: 100%;
	margin: 4px auto;
	border-top: 1px solid #bdbdbd66;
	border-bottom: 2px solid #0a0a0a66;
}

.todo {
	background: #303030;
	padding: 12px;
	margin: 0;
	font-weight: bold;
	text-align: left;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	transition: 0.2s;
	user-select: none;
}

.todo img {
	width: 16px;
	height: 16px;
	background: #bdbdbd;
	border-radius: 50%;
	padding: 2px;
	box-sizing: border-box;
	margin-right: 4px;
	opacity: 0;
	transition: 0.2s;
}

.done {
	opacity: 0.5;
}

.nameInput {
	width: 100%;
	margin: 0;
	padding: 0;
	background-color: inherit;
	color: inherit;
	font-size: inherit;
	font-weight: inherit;
	border: none;
	outline: none;
}
</style>
