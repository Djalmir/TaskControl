<template>
	<div class="home">
		<BaseAddButton @add="addList" />
		<div id="list">
			<div v-for="(list, index) in listsArray" :key="index" class="linkContainer">
				<router-link to="/about">
					<figure @contextmenu.prevent="subMenu(list.id)">
						<ListImage :list="list" class="listImage" />
						<figcaption>
							<span v-if="home.renaming != list.id">{{ list.name }}</span>
							<input
								type="text"
								placeholder="Nome"
								:id="'nameInput' + list.id"
								:value="list.name"
								class="nameInput"
								v-if="home.renaming == list.id"
								autocomplete="off"
								@keypress.enter="renameOrSave(list)"
								@keydown.esc="delOrCancel(list)"
							/>
						</figcaption>
					</figure>
				</router-link>
				<transition name="grow">
					<div class="subMenu" v-if="home.showingSubMenu == list.id">
						<button
							:class="{ deleteBtn: !home.renaming, cancelBtn: home.renaming }"
							@click="delOrCancel(list)"
						>
							<img :src="require('../assets/trash.svg')" v-if="!home.renaming" />
							<img :src="require('../assets/cancel.svg')" v-else />
						</button>
						<button
							:class="{ renameBtn: !home.renaming, saveBtn: home.renaming }"
							@click="renameOrSave(list)"
						>
							<img :src="require('../assets/edit.svg')" v-if="!home.renaming" />
							<img :src="require('../assets/done.svg')" v-else />
						</button>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
import ListImage from '../components/ListImage'
import Axios from '../services/Axios'
import { mapState } from 'vuex'
import BaseAddButton from '../components/BaseAddButton.vue'
export default {
	name: 'Home',
	components: {
		ListImage,
		BaseAddButton
	},
	data() {
		return {
			listsArray: []
		}
	},
	computed: {
		...mapState(['lists', 'home'])
	},
	beforeMount() {
		this.getLists()
		document.body.addEventListener('click', e => {
			let target = e.target
			for (let i = 0; i < 3; i++) {
				if (target.classList.contains('subMenu') || target.tagName == 'INPUT') break
				else target = target.parentElement
			}
			if (!target.classList.contains('subMenu') && target.tagName != 'INPUT') {
				this.home.showingSubMenu = null
				this.home.renaming = null
			}
		})
	},
	methods: {
		getLists() {
			this.listsArray = []
			Axios.getLists()
				.then(res => {
					this.listsArray = res.data.reverse()
					this.$store.dispatch('setLists', this.listsArray)
				})
				.catch(err => {
					console.log(err.response)
				})
		},
		addList(name) {
			Axios.postList(name)
				.then(res => {
					this.$store.dispatch('setLists', [res.data, ...this.lists])
					this.getLists()
				})
				.catch(err => {
					console.log(err.response)
				})
		},
		subMenu(id) {
			this.home.renaming = null
			this.home.showingSubMenu = id
		},
		delOrCancel(list) {
			if (this.home.renaming) this.home.renaming = null
			else {
				if (confirm(`Remover a lista ${list.name}?`)) {
					Axios.deleteList(list.id)
						.then(() => {
							this.getLists()
						})
						.catch(err => {
							console.log(err.response)
						})
				}
			}
		},
		renameOrSave(list) {
			if (this.home.renaming) {
				let input = document.querySelector(`#nameInput${list.id}`)
				if (input.value.trim() != '') {
					Axios.putList(list.id, input.value, list.todos)
						.then(() => {
							this.$store.dispatch('setLists', this.lists)
							this.home.renaming = null
							this.home.showingSubMenu = null
							this.getLists()
						})
						.catch(err => {
							console.log(err.response)
						})
				} else input.focus()
			} else {
				this.home.renaming = list.id
				setTimeout(() => {
					let input = document.querySelector(`#nameInput${list.id}`)
					input.focus()
				}, 200)
			}
		}
	}
}
</script>

<style scoped>
#list {
	width: 90%;
	margin: 60px auto;
	padding: 20px 12px;
	border-radius: 0.4rem;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-wrap: wrap;
}

.linkContainer {
	margin: 12px 4px 16px;
	padding: 0;
	border-radius: 0.2rem;
	overflow: hidden;
	box-shadow: 0 0 4px 2px #00000066;
	min-width: 200px;
	flex: 1;
	box-sizing: border-box;
}

a {
	text-decoration: none;
	-webkit-tap-highlight-color: #00000033;
}

figure {
	background-color: #101010;
	user-select: none;
	cursor: pointer;
	margin: 0;
}

.listImage {
	height: 100px;
}

figcaption {
	background-color: #303030;
	font-weight: bolder;
	color: #ccc;
	padding: 10px 0;
}

.nameInput {
	width: 100%;
	margin: 0;
	padding: 0;
	text-align: center;
	background-color: inherit;
	color: inherit;
	font-size: inherit;
	font-weight: inherit;
	border: none;
	outline: none;
}

.subMenu {
	display: flex;
	transform-origin: top;
}

.subMenu button {
	border: 1px solid #303030;
	flex: 1;
	height: 40px;
	outline: none;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
}

.deleteBtn {
	border-radius: 0 0 0 0.2rem;
	background-color: #ff5555;
}

.cancelBtn {
	border-radius: 0 0 0 0.2rem;
	background-color: #ff954e;
}

.renameBtn {
	border-radius: 0 0 0.2rem 0;
	background-color: #f5ff67;
}

.saveBtn {
	border-radius: 0 0 0.2rem 0;
	background-color: #c2ff7c;
}

.subMenu button:active img {
	transform: scale(0.8);
}

.subMenu img {
	height: 22px;
	transition: 0.2s;
}

.grow-enter-active {
	animation: grow linear 0.1s 1;
}

.grow-leave-active {
	animation: grow reverse linear 0.1s 1;
}

@keyframes grow {
	0% {
		height: 0;
	}
	100% {
		height: 40px;
	}
}
</style>
