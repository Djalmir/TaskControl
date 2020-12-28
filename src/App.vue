<template>
	<div id="app">
		<Menu :menuLeft="menuLeft" />
		<router-view />
	</div>
</template>

<script>
import { mapState } from 'vuex'
import Menu from './components/Menu'
export default {
	data() {
		return {
			touchStart: null,
			touchPos: null,
			menuLeft: undefined
		}
	},
	components: {
		Menu
	},
	computed: {
		...mapState(['showingMenu'])
	},
	mounted() {
		window.addEventListener('touchstart', this.setTouchStart)
		window.addEventListener('mousedown', this.setTouchStart)
		window.addEventListener('touchmove', this.setTouchPos, { passive: false })
		window.addEventListener('mousemove', this.setTouchPos)
		window.addEventListener('touchend', this.setTouchEnd)
		window.addEventListener('mouseup', this.setTouchEnd)
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
					if (left <= 0) this.menuLeft = left
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
					if (this.menuLeft >= -150) this.$store.dispatch('setShowingMenu')
					else this.menuLeft = undefined
				} else {
					if (this.menuLeft < -150) this.$store.dispatch('setShowingMenu')
					else this.menuLeft = undefined
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
	padding: 80px 10px 40px;
	box-sizing: border-box;
}
</style>
