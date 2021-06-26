<template>
	<div>
		<BaseAddButton @add="addList" />
		<div id="list">
			<div v-for="(list, index) in list.lists" :key="index" class="linkContainer">
				<router-link :to="'/list/' + list._id">
					<figure @contextmenu.prevent="(e) => {
								if (e.target.tagName != 'INPUT') subMenu(list._id)
								else e.target.select()
							}
						">
						<ListImage :list="list" class="listImage" />
						<figcaption>
							<div v-if="renaming != list._id">{{ list.name }}</div>
							<input type="text" placeholder="Nome" :id="'nameInput' + list._id" :value="list.name" class="nameInput" v-if="renaming == list._id" autocomplete="off" @keypress.enter="renameOrSave(list)" @keydown.esc="delOrCancel(list)" />
						</figcaption>
					</figure>
				</router-link>
				<SubMenu :item="list" @delOrCancel="delOrCancel" @renameOrSave="renameOrSave" />
			</div>
			<Confirm ref="confirmDialog" />
		</div>
	</div>
</template>

<script>
import ListImage from '../components/ListImage'
import SubMenu from '../components/SubMenu'
import Axios from '../services/Axios'
import {mapState} from 'vuex'
import BaseAddButton from '../components/BaseAddButton'
import Confirm from '../components/Confirm'
export default {
	name: 'Home',
	components: {
		ListImage,
		BaseAddButton,
		SubMenu,
		Confirm
	},
	computed: {
		...mapState(['list', 'showingSubMenu', 'renaming'])
	},
	beforeMount() {
		this.list.list = null
		this.getLists()
	},
	methods: {
		getLists() {
			let listsArray = []
			Axios.getLists()
				.then(res => {
					listsArray = res.data.reverse()
					this.$store.dispatch('list/setLists', listsArray)
				})
		},
		addList(name) {
			Axios.postList(name)
				.then(res => {
					this.$store.dispatch('list/setLists', [res.data, ...this.list.lists])
				})
		},
		subMenu(id) {
			this.$store.dispatch('setRenaming', null)
			this.$store.dispatch('setShowingSubMenu', id)
		},
		async delOrCancel(list) {
			if (this.renaming)
				this.$store.dispatch('setRenaming', null)
			else {
				if (await this.$refs.confirmDialog.confirm('CONFIRME', `Deseja mesmo remover a lista ${ list.name }?`)) {
					Axios.deleteList(list._id)
						.then(() => {
							let items = this.list.lists.filter(l => l.id != list._id)
							this.$store.dispatch('list/setLists', items, {root: true})
							this.getLists()
						})
				}
			}
		},
		renameOrSave(list) {
			if (this.renaming) {
				let input = document.querySelector(`#nameInput${ list._id }`)
				if (input.value.trim() != '') {
					return Axios.putList({
						_id: list._id,
						name: input.value,
						todos: list.todos
					})
						.then(() => {
							list.name = input.value
							this.$store.dispatch('list/setLists', this.list.lists)
							this.$store.dispatch('setRenaming', null)
							this.$store.dispatch('setShowingSubMenu', null)
						})
				}
				else
					input.focus()
			}
			else {
				this.$store.dispatch('setRenaming', list._id)
				setTimeout(() => {
					let input = document.querySelector(`#nameInput${ list._id }`)
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
	padding: 0;
}

figcaption div {
	padding: 10px 0;
}

.nameInput {
	width: 100%;
	margin: 0;
	padding: 10px 0;
	text-align: center;
	background-color: inherit;
	color: inherit;
	font-size: inherit;
	font-weight: inherit;
	border: none;
	outline: none;
}
</style>
