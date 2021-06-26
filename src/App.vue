<template>
	<div id="app">
		<Menu v-if="session.user" :menuLeft="menuLeft" />
		<router-view />
		<Message ref="Message" />
		<Loading />
	</div>
</template>

<script>
import {mapState} from 'vuex'
import Menu from './components/Menu'
import Message from './components/Message'
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
	watch:{
		async message(){
			if (this.message)
				await this.$refs.Message.show(this.message)
		},
		$route(){
			this.$store.dispatch('setCurrentPath', this.$route.path)
		}
	},
	components: {
		Menu,
		Message,
		Loading
	},
	computed: {
		...mapState([
			'session', 
			'list', 
			'showingMenu',
			'message'
		])
	},
	mounted() {
		if(this.session.user){
			let listsArray = []
			Axios.getLists()
				.then(res => {
					listsArray = res.data.reverse()
					this.$store.dispatch('list/setLists', listsArray)
				})
		}

		window.addEventListener('touchstart', this.setTouchStart)
		window.addEventListener('mousedown', this.setTouchStart)
		window.addEventListener('touchmove', this.setTouchPos, {passive: false})
		window.addEventListener('mousemove', this.setTouchPos)
		window.addEventListener('touchend', this.setTouchEnd)
		window.addEventListener('mouseup', this.setTouchEnd)
		window.addEventListener('click', e => {
			let target = e.target
			if (!e.target.id.includes('nameInput')) {
				for (let i = 0; i < 3; i++) {
					if (target.classList.contains('subMenu') || target.tagName == 'INPUT' || !target.parentElement) break
					else target = target.parentElement
				}
				if (!target.classList.contains('subMenu') && target.tagName != 'INPUT') {
					this.$store.dispatch('setShowingSubMenu', null)
					this.$store.dispatch('setRenaming', null)
				}
			}
		})
	},
	methods: {
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
::-webkit-scrollbar {
	background: transparent;
	width: 8px;
	height: 4px;
}

::-webkit-scrollbar-track {
	background: transparent;
}

::-webkit-scrollbar-thumb {
	background: linear-gradient(to bottom, #161616, #303030, #161616);
	box-shadow: inset 0px 0px 5px #00000080;
	border-radius: .2rem 0 0 .2rem;
}

::selection {
	background-color: #0099ff;
	color: #121212;
}

:-webkit-autofill,
:-webkit-autofill:hover,
:-webkit-autofill:focus {
	-webkit-box-shadow: inset 0 0 5px #0000004d, inset 0 0 0 1000px #505050 !important;
	box-shadow: inset 0 0 5px #0000004d, inset 0 0 0 1000px #505050 !important;
	border: 2px solid #505050 !important;
	-webkit-text-fill-color: #ddd;
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

.textInputOuter {
	border: none;
	border-radius: .4rem;
	padding: 0;
	margin: 30px 0 ;
	text-align: left;
	position: relative;
}

.textInputLabel {
	position: absolute;
	background-color: #505050;
	margin: -16px 0 0 5px;
	border: none;
	border-radius: .2rem .2rem 0 0;
	padding: 1px 4px;
	font-size: 14px;
	font-weight: bold;
	transition: 0.2s;
	cursor: text;
}

.textInputLabelEmpty {
	margin: 11px 0 0 8px !important;
	border: none !important;
	font-size: 16px !important;
}

.textInputInner {
	background: #505050;
	color: #ddd;
	width: 100%;
	font-size: 16px;
	padding: 10px;
	outline: none;
	box-sizing: border-box;
	border: 2px solid transparent;
	border-radius: .4rem;
	letter-spacing: 1px;
}

.textInputInner:focus {
	box-shadow: inset 0 0 5px #0000004d;
}

.greenBt {
	outline: none;
	border: none;
	background-color: #c2ff7c;
	color: #202020;
	font-weight: bolder;
	letter-spacing: 1px;
	border-radius: 0.4rem;
	margin: 10px 0;
	padding: 8px 12px;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
	box-sizing: border-box;
}

.greenBt:hover,
.greenBt:focus{
	box-shadow: 0 0 5px #0000004d;
}

.greenBt:active{
	transform: scale(.98);
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
