<template>
	<transition name="fade">
		<div id="messageContainer" v-if="showing">
			<div id="shadow"></div>
			<div id="messageDiv">
				<div id="messageHeader">{{title}}</div>
				<div id="messageBody">
					<p id="messageMsg"></p>
				</div>
				<div id="messageFooter">
					<button id="messageOkBt">Ok</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'Message',
	data() {
		return {
			showing: false,
			title: '',
			message: ''
		}
	},
	methods: {
		async show({title, msg}) {
			this.showing = await true
			this.title = await title
			this.message = await msg
			document.querySelector('#messageMsg').innerText = await this.message
			let okBt = await document.getElementById('messageOkBt')
			return new Promise((res) => {
				okBt.onclick = () => {
					this.$store.dispatch('showMessage', null)
					this.showing = false
					res(true)
				}
			})
		}
	}
}
</script>

<style scoped>
#messageContainer {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	z-index: 2;
}
#shadow {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100vh;
	background: #000000bd;
}
#messageDiv {
	margin: auto;
	z-index: 1;
	width: 80%;
	height: fit-content;
	max-height: 80%;
	box-sizing: border-box;
	border-radius: 0.3rem;
	box-shadow: 0 0 10px #0000004d;
}
#messageHeader {
	background: #202020;
	padding: 8px 14px;
	text-align: left;
	border-radius: 0.4rem 0.4rem 0 0;
	font-weight: bolder;
}
#messageBody {
	background: #303030;
	padding: 20px 8px;
	box-sizing: border-box;
	max-height: calc(100vh - 190px);
	overflow-y: auto;
}
#messageFooter {
	background: #202020;
	display: flex;
}

button {
	border: 1px solid #303030;
	flex: 1;
	height: 40px;
	outline: none;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: bolder;
	color: #303030;
}

#messageOkBt {
	background: #0099ff;
	border-radius: 0 0 .3rem 0.3rem;
	transform-origin: top;
}

#messageOkBt:active {
	transform: rotateX(15deg);
}
</style>