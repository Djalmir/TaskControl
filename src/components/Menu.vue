<template>
	<div>
		<div id="header">
			<button @click="showMenu">
				<img :src="require('../assets/menu.svg')" />
			</button>
			<span id="title">{{ list.list ? list.list.name : 'TaskControl' }}</span>
		</div>
		<transition name="shadowOpacity">
			<div id="shadow" v-if="menuLeft != undefined || showingMenu" @click="showingMenu && menuLeft == undefined ? showMenu() : ''"></div>
		</transition>
		<div id="nav" :class="{ showing: showingMenu, visible: menuLeft != undefined || showingMenu }">
			<div id="navHeader">
				<router-link to="/" id="homeLink">TaskControl</router-link>
			</div>
			<div id="navBody">
				<template v-for="(list, index) in list.lists">
					<router-link :to="'/list/' + list.id" :key="index">{{ list.name }}</router-link>
				</template>
			</div>
			<div id="navFooter">
				<p>Created by Djalmir Miodutzki</p>
			</div>
		</div>
	</div>
</template>

<script>
import {mapState} from 'vuex'
export default {
	props: ['menuLeft'],
	watch: {
		menuLeft() {
			let nav = document.querySelector('#nav')
			if (this.menuLeft != undefined) {
				nav.style.transition = '0s'
				nav.style.left = this.menuLeft + 'px'
			} else {
				nav.style.transition = '.2s'
				nav.style.left = ''
				if (this.showingMenu) nav.classList.add('showing')
				else nav.classList.remove('showing')
			}
		}
	},
	computed: {
		...mapState(['showingMenu', 'list'])
	},
	methods: {
		showMenu() {
			this.$store.dispatch('setShowingMenu')
		}
	}
}
</script>

<style scoped>
#header {
	background-color: #161616;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 40px;
	box-shadow: 0 0 10px 2px #00000099;
	text-align: left;
	display: flex;
	z-index: 2;
}

button {
	outline: none;
	border: none;
	background-color: transparent;
	border-radius: 0.4rem;
	width: 32px;
	height: 32px;
	margin: 4px;
	z-index: 1;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
}

/* button:active {
	background-color: #bdbdbd66;
} */

button:active img {
	transform: scale(0.8);
}

button img {
	width: 100%;
	height: 100%;
	transition: 0.2s;
}

#title {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	line-height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20px;
	font-weight: bolder;
	user-select: none;
}

#shadow {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	background-color: #00000099;
	z-index: 2;
}

#nav {
	position: fixed;
	top: 0;
	left: -300px;
	width: 80%;
	height: 100vh;
	max-width: 300px;
	background-color: #161616;
	display: flex;
	flex-direction: column;
	padding: 0;
	box-sizing: border-box;
	transition: 0.2s;
	user-select: none;
	z-index: 2;
}

#nav.visible {
	box-shadow: 5px 0 10px #00000099;
}

#nav.showing {
	left: 0;
}

#navHeader {
	display: flex;
	flex-direction: column;
	border-bottom: 1px solid #00000066;
}

#navBody {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: auto;
	padding: 10px 0;
}

#navFooter {
	display: flex;
	flex-direction: column;
	border-top: 2px solid #00000066;
	background-color: #121212;
	font-style: italic;
}

a {
	text-decoration: none;
	color: #bdbdbd;
	font-weight: bolder;
	background-color: #121212;
	padding: 12px 0;
	border-top: 1px solid #202020;
	border-bottom: 1px solid #0a0a0a;
	-webkit-tap-highlight-color: #bdbdbd33;
}

.shadowOpacity-enter-active {
	animation: shadowOpacity linear 0.2s 1;
}

.shadowOpacity-leave-active {
	animation: shadowOpacity reverse linear 0.2s 1;
}

@keyframes shadowOpacity {
	0% {
		display: none;
		opacity: 0;
	}
	100% {
		display: block;
		opacity: 0.8;
	}
}
</style>
