<template>
	<div>
		<BaseAddButton @add="addTodo" />
		<div id="list">
			<div v-for="(todo, index) in list.todos" :key="index" class="todoContainer">
				<div
					class="todo"
					:class="{ done: todo.done }"
					@click="setTodoDone(todo)"
					@contextmenu.prevent="
						e => {
							if (e.target.tagName != 'INPUT') subMenu(todo.index)
							else e.target.select()
						}
					"
				>
					<img :src="require('../assets/done.svg')" :style="todo.done ? 'opacity:1' : 'opacity:0'" />
					{{ todo.name }}
				</div>
				<SubMenu :item="todo" />
			</div>
		</div>
	</div>
</template>

<script>
import Axios from '../services/Axios'
import SubMenu from '../components/SubMenu'
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
	beforeRouteUpdate(to, from, next) {
		this.$store.dispatch('list/setList', to.params.id).then(list => {
			to.params.list = list
			next()
		})
	},
	beforeMount() {
		this.list.todos = this.list.todos.sort((a, b) => {
			return a.index - b.index
		})
	},
	methods: {
		addTodo(name) {
			let todo = {
				name: name,
				done: false,
				index: this.list.todos.length
			}
			let todos = [...this.list.todos, todo]
			Axios.putList(this.list.id, this.list.name, todos)
				.then(() => {
					this.$store.dispatch('list/setTodos', todos)
					window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
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
		subMenu(index) {
			this.$store.dispatch('setRenaming', null)
			this.$store.dispatch('setShowingSubMenu', index)
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
</style>
