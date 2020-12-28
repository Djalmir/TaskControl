<template>
	<div>
		<div id="header">
			<button @click="showMenu">
				<svg viewBox="0 0 32 32">
					<rect x="0" y="4" rx="2" ry="2" width="32" height="6" fill="#000" />
					<rect x="0" y="14" rx="2" ry="2" width="32" height="6" fill="#000" />
					<rect x="0" y="24" rx="2" ry="2" width="32" height="6" fill="#000" />
				</svg>
			</button>
			<span id="title">TaskControl</span>
		</div>
		<transition name="shadowOpacity">
			<div
				id="shadow"
				v-if="menuLeft != undefined || showingMenu"
				@click="showingMenu && menuLeft == undefined ? showMenu() : ''"
			></div>
		</transition>
		<div id="nav" :class="{ showing: showingMenu, visible: menuLeft != undefined || showingMenu }">
			<router-link to="/" id="homeLink">Início</router-link>
			<router-link to="/about" v-for="(list, index) in lists" :key="index">{{ list.name }}</router-link>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
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
		...mapState(['showingMenu', 'lists'])
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
}

button {
	outline: none;
	border: none;
	background-color: #bdbdbd;
	border-radius: 0.4rem;
	width: 32px;
	height: 32px;
	margin: 4px;
	z-index: 1;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
}

button:active {
	background-color: #bdbdbd66;
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
}

#shadow {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	background-color: #00000099;
}

#nav {
	position: fixed;
	top: 0;
	left: -300px;
	width: 90%;
	height: 100%;
	max-width: 300px;
	background-color: #161616;
	display: flex;
	flex-direction: column;
	padding: 30px 0;
	transition: 0.2s;
	user-select: none;
}

#nav.visible {
	box-shadow: 5px 0 10px #00000099;
}

#nav.showing {
	left: 0;
}

a#homeLink {
	margin-bottom: 20px;
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
