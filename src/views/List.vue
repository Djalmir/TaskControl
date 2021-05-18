<template>
	<div>
		<BaseAddButton @add="addTodo" />
		<div id="list">
			<div v-for="todo in this.list.todos" :key="todo.id" class="todoContainer" @touchstart="(e)=>setComponentClicked(e, todo)" @click="(e)=>{if(e.target.id!='nameInput'+todo.id)setTodoDone(todo)}">
				<div class="todo" :class="{ done: todo.done }"  
					@contextmenu.prevent="(e) => {
						if (e.target.id != ('nameInput' + todo.id)) 
							subMenu(todo.id)
						else 
							e.target.select()
					}
				">
					<img :src="require('../assets/done.svg')" :style="todo.done ? 'opacity:1' : 'opacity:0'" />
					<pre :id="'input' + todo.id" class="nameInput" v-if="renaming !== todo.id" disabled>{{todo.name}}</pre>
					<textarea placeholder="Nome" :id="'nameInput' + todo.id" :value="todo.name" class="nameInput" v-if="renaming === todo.id" autocomplete="off" @keypress.enter="renameOrSave(todo)" @keydown.esc="delOrCancel(todo)" @input="setTodoHeight(todo.id)" />
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
	data() {
		return {
			componentClicked: null,
			initialTouch: null,
			movingTodo: null,
			movingShadow: null,
			jsonMovingTodo: null,
			scrolling: 'none',
			scrollTimer: null
		}
	},
	components: {
		SubMenu
	},
	computed: {
		...mapState(['lists', 'showingMenu', 'showingSubMenu', 'renaming'])
	},
	beforeRouteUpdate(to, from, next) {
		this.$store.dispatch('list/setList', to.params.id)
			.then(list => {
				to.params.list = list
				next()
			})
	},
	beforeMount() {
		document.body.addEventListener('touchmove', this.touchMove, {passive: false})
		document.body.addEventListener('touchend', this.touchEnd, {passive: false})
	},
	watch: {
		list() {
			console.log(this.list.name)
		}
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
			if(!this.renaming&&!this.showingSubMenu){
				todo.done = !todo.done
				Axios.putList(this.list.id, this.list.name, this.list.todos)
					.then(() => {
						this.$store.dispatch('list/setTodos', this.list.todos)
					})
					.catch(err => {
						console.log(err.response)
					})
			}
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
					this.setTodoHeight(todo.id)
					document.querySelector(`#nameInput${ todo.id }`).focus()
				}, 50)
			}
		},
		setComponentClicked(e, jsonMovingTodo) {
			if (!e.target.id.includes('nameInput')){
				this.componentClicked = e.target
				this.jsonMovingTodo = jsonMovingTodo
				while (!this.componentClicked.classList.contains('list') && !this.componentClicked.classList.contains('todoContainer'))
					this.componentClicked = this.componentClicked.parentNode

				if (this.componentClicked.classList.contains('todoContainer')) {
					this.initialTouch = {
						x: e.touches[0].clientX,
						y: e.touches[0].clientY
					}
					// console.log(this.componentClicked)
					// console.log('x: ', this.initialTouch.x, ' y: ', this.initialTouch.y)
				}
				else{
					this.componentClicked = null
					this.initialTouch = null
				}
			}
		},
		touchMove(e) {
			if (this.componentClicked) {
				let touchX = e.touches[e.touches.length - 1].clientX
				let touchY = e.touches[e.touches.length - 1].clientY
				if (!this.movingTodo&&!this.$parent.menuLeft&&!this.renaming) {
					if ((touchX - this.initialTouch.x > 20 || this.initialTouch.x - touchX > 20) && (touchY <= this.initialTouch.y + 5 && touchY >= this.initialTouch.y - 5)) {
						this.setMovingTodo()
					}
					else if (touchY - this.initialTouch.y > 20 || this.initialTouch.y - touchY > 20) {
						this.componentClicked = null
					}
				}
				else if(!this.$parent.menuLeft&&!this.renaming){
					this.movingShadow.style.top = `${ touchY - (this.movingShadow.offsetHeight / 2) + window.scrollY }px`

					let listDiv = document.getElementById('list')
					let todos = Array.from(listDiv.children)
					todos.map((todo, todoIndex) => {
						if (todo != this.movingTodo) {
							let todoBounds = todo.getBoundingClientRect()
							if (touchY > todoBounds.y && touchY < todoBounds.y + todoBounds.height / 2) {
								listDiv.insertBefore(this.movingTodo, todo)
								if (this.list.todos.indexOf(this.jsonMovingTodo) > todoIndex) {
									this.list.todos.splice(this.list.todos.indexOf(this.jsonMovingTodo), 1)
									this.list.todos.splice(todoIndex, 0, this.jsonMovingTodo)
								}
								else {
									this.list.todos.splice(this.list.todos.indexOf(this.jsonMovingTodo), 1)
									this.list.todos.splice(todoIndex - 1, 0, this.jsonMovingTodo)
								}
							}
							else if (touchY > todoBounds.y && touchY < todoBounds.y + todoBounds.height) {
								listDiv.insertBefore(this.movingTodo, todo.nextSibling)
								if (this.list.todos.indexOf(this.jsonMovingTodo) > todoIndex) {
									this.list.todos.splice(this.list.todos.indexOf(this.jsonMovingTodo), 1)
									this.list.todos.splice(todoIndex + 1, 0, this.jsonMovingTodo)
								}
								else {
									this.list.todos.splice(this.list.todos.indexOf(this.jsonMovingTodo), 1)
									this.list.todos.splice(todoIndex, 0, this.jsonMovingTodo)
								}
							}
						}
					})

					if (touchY <= 20 * (listDiv.offsetHeight / 100)) {
						if (this.scrolling != 'top') {
							this.scrolling = 'top'
							this.scrollList(listDiv)
						}
					}
					else if (touchY >= 90 * (window.innerHeight / 100)) {
						if (this.scrolling != 'bottom') {
							this.scrolling = 'bottom'
							this.scrollList(listDiv)
						}
					}
					else {
						this.scrolling = 'none'
					}
					e.preventDefault()
				}
			}
		},
		touchEnd() {
			if (this.componentClicked) {
				this.componentClicked = null
				this.initialTouch = null
				this.scrolling='none'
				if (this.movingTodo) {
					this.movingTodo.style = ''
					this.movingTodo = null
				}
				if (this.movingShadow) {
					document.body.removeChild(this.movingShadow)
					this.movingShadow = null
					Axios.putList(this.list.id, this.list.name, this.list.todos)
						.then(() => {
							this.$store.dispatch('list/setTodos', this.list.todos)
						})
						.catch(err => {
							console.log(err.response)
						})
				}
			}
		},
		setMovingTodo() {
			if(!this.movingTodo){
				this.movingTodo = this.componentClicked
				this.movingShadow = this.movingTodo.cloneNode(true)
				this.movingShadow.classList = this.movingTodo.classList
				Object.assign(this.movingShadow.style, {
					position: 'absolute',
					left: '0',
					background: '#303030',
				// 	padding: '12px',
				// 	margin: '0',
					fontWeight: 'bold',
				// 	textAlign: 'left',
				// 	display: 'flex',
				// 	alignItems: 'center',
				// 	boxSizing: 'border-box',
				// 	transition: '0.2s',
				// 	userSelect: 'none',
					color: '#bdbdbd',
				// 	width: '100%',
					
				// 	borderTop: '1px solid #bdbdbd66',
				// 	borderBottom: '2px solid #0a0a0a66',
					fontFamily: 'sans-serif',
					webkitFontSmoothing: 'antialiased',
					mozOsxFontSmoothing: 'grayscale'
				})
				document.body.appendChild(this.movingShadow)
				this.movingTodo.style.opacity = '.3'
			}
		},
		scrollList() {
			if (this.scrolling != 'none') {
				window.scrollBy({
					left: 0,
					top: this.scrolling == 'top' ? -8 : 8
				})

				clearTimeout(this.scrollTimer)
				this.scrollTimer = setTimeout(() => {
					if (this.scrolling != 'none')
						this.scrollList()
				}, 16)

			}
		},
		setTodoHeight(todoId){
			let input = document.querySelector(`#nameInput${ todoId }`)
			let linesCount = Math.floor(input.scrollHeight/16)
			input.setAttribute('rows',linesCount)
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
	width: 100%;
	height: fit-content;
	background: #303030;
	padding: 12px;
	margin: 0;
	font-family: inherit;
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
	font-family: inherit;
	font-size: inherit;
	font-weight: inherit;
	border: none;
	outline: none;
	resize: none;
	white-space: pre-wrap;
}
</style>
