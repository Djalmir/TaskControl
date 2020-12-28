<template>
	<div class="home">
		<BaseAddButton @add="addList" />
		<div id="list">
			<router-link v-for="(list, index) in listsArray" :key="index" to="/about">
				<figure>
					<ListImage :list="list" />
					<figcaption>{{ list.name }}</figcaption>
				</figure>
			</router-link>
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
		...mapState(['lists'])
	},
	beforeMount() {
		this.getLists()
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
					this.$store.dispatch('setLists', [res.data, ...this.listsArray])
					this.getLists()
				})
				.catch(err => {
					console.log(err.response)
				})
		}
	}
}
</script>

<style scoped>
#list {
	width: 90%;
	list-style: none;
	margin: 60px auto;
	padding: 20px 12px;
	background-color: #161616;
	border-radius: 0.4rem;
	box-shadow: inset 0 0 10px 2px #00000066;
}

a {
	text-decoration: none;
	-webkit-tap-highlight-color: #00000033;
}

figure {
	background-color: #101010;
	border-radius: 0.2rem;
	box-shadow: inset 0 0 10px 2px #00000066;
	margin: 12px 0 16px;
	user-select: none;
	cursor: pointer;
}

figcaption {
	background-color: #303030;
	font-weight: bolder;
	border-radius: 0 0 0.2rem 0.2rem;
	color: #ccc;
	padding: 10px 0;
	box-shadow: inset 0 -2px 10px 2px #00000099, 0 -10px 10px -8px #00000066;
}
</style>
