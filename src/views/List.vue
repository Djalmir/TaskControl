<template>
	<div>
		<BaseAddButton @add="addTodo" />
		<div id="list">
			<div v-for="todo in this.list.todos" :key="todo._id" class="todoContainer" @touchstart="(e)=>setComponentClicked(e, todo)" @click.prevent="(e)=>{if(e.target.id!='nameInput'+todo._id)setTodoDone(todo)}">
				<div class="todo" :class="{ done: todo.done }" @contextmenu.prevent="(e) => {
						if (e.target.id != ('nameInput' + todo._id)) 
							subMenu(todo._id)
						else 
							e.target.select()
					}
				">
					<img :src="require('../assets/done.svg')" :style="todo.done ? 'opacity:1' : 'opacity:0'" />
					<pre :id="'input' + todo._id" class="nameInput" v-if="renaming !== todo._id" disabled>{{todo.name}}</pre>
					<textarea placeholder="Nome" :id="'nameInput' + todo._id" :value="todo.name" class="nameInput" v-if="renaming === todo._id" autocomplete="off" @keydown.esc="delOrCancel(todo)" @input="setTodoHeight(todo._id)" />
				</div>
				<SubMenu :item="todo" @delOrCancel="delOrCancel" @renameOrSave="renameOrSave" />
			</div>
			<Confirm ref="confirmDialog" />
		</div>
	</div>
</template>

<script>
import Axios from '../services/Axios'
import SubMenu from '../components/SubMenu'
import Confirm from '../components/Confirm'
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
		SubMenu,
		Confirm
	},
	computed: {
		...mapState(['showingMenu', 'showingSubMenu', 'renaming'])
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
	methods: {
		addTodo(name) {
			let todo = {
				_id: 1 + Math.floor(Math.random() * 9999999),
				name: name,
				done: false
			}
			while (this.list.todos.find(t => t._id == todo._id))
				todo._id = 1 + Math.floor(Math.random() * 9999999)
			let todos = [...this.list.todos, todo]
			Axios.putList({
				_id: this.list._id,
				name: this.list.name,
				todos: todos
			})
				.then(() => {
					this.$store.dispatch('list/setTodos', todos)
					window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})
				})
				.catch(err => {
					console.log(err.response)
				})
		},
		setTodoDone(todo) {
			if (!this.renaming && !this.showingSubMenu) {
				todo.done = !todo.done
				Axios.putList({
					_id: this.list._id,
					name: this.list.name,
					todos: this.list.todos
				})
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
		async delOrCancel(todo) {
			if (this.renaming)
				this.$store.dispatch('setRenaming', null)
			else {
				if (await this.$refs.confirmDialog.confirm('CONFIRME', `Deseja mesmo remover a seguinte tarefa?\n\n${ todo.name }`)) {
					let todos = this.list.todos.filter(t => t._id !== todo._id)
					Axios.putList({
						_id: this.list._id,
						name: this.list.name,
						todos: todos
					})
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
				let input = document.querySelector(`#nameInput${ todo._id }`)
				if (input.value.trim() != '') {
					this.list.todos.find(t => t._id == todo._id).name = input.value
					return Axios.putList({
						_id: this.list._id,
						name: this.list.name,
						todos: this.list.todos
					})
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
				this.$store.dispatch('setRenaming', todo._id)
				setTimeout(() => {
					this.setTodoHeight(todo._id)
					document.querySelector(`#nameInput${ todo._id }`).focus()
				}, 50)
			}
		},
		setComponentClicked(e, jsonMovingTodo) {
			if (!e.target.id.includes('nameInput')) {
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
				else {
					this.componentClicked = null
					this.initialTouch = null
				}
			}
		},
		setShadowPos(e) {
			let touchX = e.touches[e.touches.length - 1].clientX
			let touchY = e.touches[e.touches.length - 1].clientY
			
			this.movingShadow.style.top = `${ touchY - this.initialTouch.y + window.scrollY }px`
			let x = touchX - this.initialTouch.x
			if (x < 0)
				x = 0
			else if (x + this.movingShadow.offsetWidth > window.innerWidth)
				x = window.innerWidth - this.movingShadow.innerWidth
			this.movingShadow.style.left = `${ x }px`
		},
		touchMove(e) {
			if (this.componentClicked) {
				let touchX = e.touches[e.touches.length - 1].clientX
				let touchY = e.touches[e.touches.length - 1].clientY

				if (!this.movingTodo && !this.$parent.menuLeft && !this.renaming) {
					if ((touchX - this.initialTouch.x > 20 || this.initialTouch.x - touchX > 20) && (touchY <= this.initialTouch.y + 5 && touchY >= this.initialTouch.y - 5)) {
						this.initialTouch.x = touchX - this.componentClicked.offsetLeft
						this.initialTouch.y = touchY - this.componentClicked.offsetTop + window.scrollY
						this.setMovingTodo()
					}
					else if (touchY - this.initialTouch.y > 20 || this.initialTouch.y - touchY > 20) {
						this.componentClicked = null
					}
				}
				else if (!this.$parent.menuLeft && !this.renaming) {
					e.preventDefault()

					this.setShadowPos(e)

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

					if(touchY <= 30 * (window.innerHeight / 100)) {
						if (this.scrolling != 'fast-top') {
							this.scrolling = 'fast-top'
							this.scrollList()
						}
					}
					else if (touchY <= 40 * (window.innerHeight / 100)) {
						if (this.scrolling != 'slow-top') {
							this.scrolling = 'slow-top'
							this.scrollList()
						}
					}
					else if (touchY >= 80 * (window.innerHeight / 100)) {
						if (this.scrolling != 'fast-bottom') {
							this.scrolling = 'fast-bottom'
							this.scrollList()
						}
					}
					else if (touchY >= 70 * (window.innerHeight / 100)) {
						if (this.scrolling != 'slow-bottom') {
							this.scrolling = 'slow-bottom'
							this.scrollList()
						}
					}
					else {
						this.scrolling = 'none'
					}
				}				
			}
		},
		touchEnd() {
			if (this.componentClicked) {
				this.componentClicked = null
				this.initialTouch = null
				this.scrolling = 'none'
				if (this.movingTodo) {
					this.movingTodo.style = ''
					this.movingTodo = null
				}
				if (this.movingShadow) {
					document.body.removeChild(this.movingShadow)
					this.movingShadow = null
					Axios.putList({
						_id: this.list._id,
						name: this.list.name,
						todos: this.list.todos
					})
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
			if (!this.movingTodo) {
				this.movingTodo = this.componentClicked
				this.movingShadow = this.movingTodo.cloneNode(true)
				this.movingShadow.classList = this.movingTodo.classList
				Object.assign(this.movingShadow.style, {
					position: 'absolute',
					background: '#303030',
					fontWeight: 'bold',
					color: '#bdbdbd',
					width: 'calc(100% - 20px)',
					fontFamily: 'sans-serif',
					webkitFontSmoothing: 'antialiased',
					mozOsxFontSmoothing: 'grayscale'
				})
				document.body.appendChild(this.movingShadow)
				this.movingTodo.style.opacity = '.1'
			}
		},
		scrollList() {
			if (this.scrolling != 'none') {

				let scrollTypes = {
					"slow-top": -4,
					"fast-top": -8,
					"slow-bottom": 4,
					"fast-bottom": 8
				}

				window.scrollBy({
					left: 0,
					top: scrollTypes[this.scrolling]
				})

				clearTimeout(this.scrollTimer)
				this.scrollTimer = setTimeout(() => {
					if (this.scrolling != 'none')
						this.scrollList()
				}, 16)

			}
		},
		setTodoHeight(todoId) {
			let input = document.querySelector(`#nameInput${ todoId }`)
			input.setAttribute('rows', 1)
			let linesCount = Math.floor(input.scrollHeight / 16)
			//console.log('linesCount: ',linesCount)
			input.setAttribute('rows', linesCount)
		}
	}
}
</script>

<style scoped>
#list {
	margin: 60px auto;
	padding: 0 8px;
	box-sizing: border-box;
}

.todoContainer {
	width: 100%;
	max-width: 480px;
	height: fit-content;
	margin: 4px auto;
	padding: 0 2px;
	box-sizing: border-box;
	border-top: 1px solid #bdbdbd66;
	border-bottom: 2px solid #0a0a0a66;
	border-radius: 0.2rem;
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
