<template>
	<div id="container">
		<transition name="grow">
			<div v-if="adding" id="innerContainer">
				<input type="text" placeholder="Nome" v-model="name" />
				<button @click="cancelAdding">X</button>
			</div>
		</transition>
		<button @click="add">+</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			adding: false,
			name: ''
		}
	},
	methods: {
		cancelAdding() {
			this.name = ''
			this.adding = false
		},
		add() {
			if (this.adding && this.name.trim() !== '') {
				this.$emit('add', this.name)
			} else {
				this.adding = true
			}
		}
	}
}
</script>

<style scoped>
#container {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-bottom: 15px;
	background-color: #161616;
	padding: 10px 4px;
	box-sizing: border-box;
	border-radius: 0.4rem;
}

button {
	outline: none;
	border: none;
	background-color: #bdbdbd;
	border-radius: 0.4rem;
	width: 32px;
	height: 32px;
	margin: 0 2px;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
}

button:active {
	background-color: #bdbdbd66;
}

input {
	outline: none;
	border: none;
	background-color: #bdbdbd;
	border-radius: 0.4rem;
	height: 30px;
	margin: 0 2px;
	padding: 0 8px;
}

#innerContainer {
	margin: 0;
	padding: 0;
	display: flex;
	align-items: center;
	overflow: hidden;
	flex: 1;
}

#innerContainer input {
	flex: 1;
	width: 100%;
}

.grow-enter-active {
	animation: grow linear 0.2s 1;
}

.grow-leave-active {
	animation: grow reverse linear 0.2s 1;
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
