<template>
	<div id="container">
		<transition name="grow">
			<div v-if="adding" id="innerContainer">
				<input type="text" placeholder="Nome" v-model="name" id="inputName" />
				<button @click="cancelAdding">
					<svg viewBox="0 0 32 32" stroke="#404040" stroke-width="10" stroke-linecap="round">
						<line x1="6" y1="6" x2="26" y2="26" />
						<line x1="26" y1="6" x2="6" y2="26" />
					</svg>
				</button>
			</div>
		</transition>
		<button @click="add" id="addBt">
			<svg viewBox="0 0 32 32" v-if="!adding" stroke="#404040" stroke-width="10" stroke-linecap="round">
				<line x1="16" y1="6" x2="16" y2="26" />
				<line x1="6" y1="16" x2="26" y2="16" />
			</svg>
			<svg viewBox="0 0 32 32" v-else stroke="#404040" stroke-width="10" stroke-linecap="round">
				<line x1="6" y1="16" x2="12" y2="26" />
				<line x1="12" y1="26" x2="26" y2="8" />
			</svg>
		</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			adding: false,
			name: '',
			currentTop: 0
		}
	},
	mounted() {
		window.addEventListener('scroll', this.scroll)
	},
	methods: {
		cancelAdding() {
			this.name = ''
			this.adding = false
		},
		add() {
			if (this.adding && this.name.trim() !== '') {
				this.$emit('add', this.name)
				this.cancelAdding()
			} else {
				this.adding = true
				window.addEventListener('animationend', this.inputFocus)
			}
		},
		scroll() {
			let container = document.querySelector('#container')
			if (window.scrollY > this.currentTop) {
				container.style.top = '-50px'
				container.style.opacity = '0'
			} else {
				container.style.top = '40px'
				container.style.opacity = '1'
			}
			this.currentTop = window.scrollY
		},
		inputFocus() {
			let input = document.querySelector('#inputName')
			if (input) input.focus()
			window.removeEventListener('animationend', this.inputFocus)
		}
	}
}
</script>

<style scoped>
#container {
	position: sticky;
	top: 40px;
	left: 0;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin: 0 0 15px 0;
	background-color: #303030;
	padding: 10px 4px;
	box-sizing: border-box;
	border-radius: 0 0 0.2rem 0.2rem;
	box-shadow: 0 2px 10px 2px #00000099;
	transition: 0.2s;
}

button {
	outline: none;
	border: none;
	background-color: #c2ff7c;
	border-radius: 0.4rem;
	width: 50px;
	height: 32px;
	margin: 0 2px;
	padding: 8px 12px;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
	box-sizing: border-box;
}

button svg {
	transition: 0.1s;
	width: 100%;
	height: 100%;
}

button:active svg {
	transform: scale(0.8);
}

input {
	outline: none;
	border: none;
	background-color: transparent;
	border-radius: 0.4rem;
	height: 32px;
	margin: 0;
	padding: 0 8px;
	font-size: 16px;
}

#innerContainer {
	margin: 0;
	padding: 0;
	display: flex;
	align-items: center;
	overflow: hidden;
	flex: 1;
	max-width: 600px;
	background-color: #fff;
	border-radius: 0.4rem;
	box-shadow: inset 0 0 10px #00000099;
}

#innerContainer input {
	flex: 1;
	width: 100%;
}

#innerContainer button {
	margin: 0;
	border-radius: 0;
	background-color: #ff5555;
	box-shadow: 0px 0 10px 2px #00000099;
}

.grow-enter-active {
	animation: grow ease-in-out 0.2s 1;
}

.grow-leave-active {
	animation: grow reverse ease-in 0.2s 1;
}

@keyframes grow {
	0% {
		flex: 0;
	}
	100% {
		flex: 1;
	}
}
</style>
