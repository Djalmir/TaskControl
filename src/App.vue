<template>
	<div id="app">
		<Menu v-if="user" :menuLeft="menuLeft" />
		<router-view />
		<Loading />
	</div>
</template>

<script>
import {mapState} from 'vuex'
import Menu from './components/Menu'
import Loading from './components/Loading'
import Axios from './services/Axios'
export default {
	data() {
		return {
			touchStart: null,
			touchPos: null,
			menuLeft: undefined,
			listsArray: []
		}
	},
	components: {
		Menu,
		Loading
	},
	computed: {
		...mapState(['user', 'lists', 'showingMenu'])
	},
	beforeMount() {
		// this.getLists()
		// window.addEventListener('click', e => {
		// 	let target = e.target
		// 	if (!e.target.id.includes('nameInput')) {
		// 		for (let i = 0; i < 3; i++) {
		// 			if (target.classList.contains('subMenu') || target.tagName == 'INPUT' || !target.parentElement) break
		// 			else target = target.parentElement
		// 		}
		// 		if (!target.classList.contains('subMenu') && target.tagName != 'INPUT') {
		// 			this.$store.dispatch('setShowingSubMenu', null)
		// 			this.$store.dispatch('setRenaming', null)
		// 		}
		// 	}
		// })
	},
	mounted() {
		window.addEventListener('touchstart', this.setTouchStart)
		window.addEventListener('mousedown', this.setTouchStart)
		window.addEventListener('touchmove', this.setTouchPos, {passive: false})
		window.addEventListener('mousemove', this.setTouchPos)
		window.addEventListener('touchend', this.setTouchEnd)
		window.addEventListener('mouseup', this.setTouchEnd)
	},
	methods: {
		getLists() {
			this.listsArray = []
			Axios.getLists()
				.then(res => {
					this.listsArray = res.data.reverse()
					this.$store.dispatch('list/setLists', this.listsArray)
				})
				.catch(err => {
					console.log(err.response)
				})
		},
		setTouchStart(e) {
			if (e.touches) {
				this.touchStart = e.touches[0]
			} else {
				this.touchStart = e
			}
		},
		setTouchPos(e) {
			if (e.touches) {
				this.touchPos = e.touches[e.touches.length - 1]
			} else {
				this.touchPos = e
			}

			if (this.touchStart) {
				if (!this.showingMenu && this.touchStart.clientX < 30) {
					let left = this.touchPos.clientX - this.touchStart.clientX - 300
					if (left <= 0)
						this.menuLeft = left
					e.preventDefault()
				} else if (this.showingMenu) {
					let left = this.touchPos.clientX - this.touchStart.clientX
					if (left <= 0) this.menuLeft = left
				}
			}
		},
		setTouchEnd() {
			if (this.menuLeft != undefined) {
				if (!this.showingMenu) {
					if (this.menuLeft >= -275)
						this.$store.dispatch('setShowingMenu')
					else
						this.menuLeft = undefined
				}
				else {
					if (this.menuLeft <= -25)
						this.$store.dispatch('setShowingMenu')
					else
						this.menuLeft = undefined
				}
			}
			this.touchStart = null
			this.touchPos = null
			this.menuLeft = null
		}
	}
}
</script>

<style>
::selection {
	background-color: #bdbdbd;
	color: #121212;
}

body {
	margin: 0;
	padding: 0;
	background-color: #202020;
}
#app {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	font-family: sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #bdbdbd;
	padding-bottom: 40px;
}

.textInputOuter{
	border: none;
	padding: 0;
	margin: 1.5em 0 2em;
	text-align: left;
	position: relative;
}

.textInputLabel{
	position: absolute;
	background-color:#fff;
	margin:-20px 0 0 4px;
	border:1px solid #252525;
	border-radius:.2rem;
	font-size:12px;
	padding:1px 4px;
	font-weight: bold;
	transition: .2s;
	cursor: text;
}

.textInputLabelEmpty{
	margin:0 0 0 8px!important;
	border:none!important;
	font-size: 14px!important;
}

.textInputInner{
	width: 100%;
	font-size: 16px;
	padding: 10px;
	outline: none;
	box-sizing: border-box;
	border: 2px solid transparent;
}

.fade-enter-active {
	animation: fade 0.2s linear;
}

.fade-leave-active {
	animation: fade 0.2s linear reverse;
}

@keyframes fade {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
</style>
