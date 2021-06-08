<template>
	<transition name="fade">
		<div id="confirmContainer" v-if="showing">
			<div id="shadow"></div>
			<div id="confirmDiv">
				<div id="confirmHeader">{{title}}</div>
				<div id="confirmBody">
					<p id="confirmMsg"></p>
				</div>
				<div id="confirmFooter">
					<button id="confirmYesBt">Sim</button>
					<button id="confirmNoBt">Não</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'Confirm',
	data() {
		return {
			showing: false,
			title: '',
			message: ''
		}
	},
	methods: {
		async confirm(title, message) {
			this.showing = await true
			this.title = await title
			this.message = await message
			document.querySelector('#confirmMsg').innerText = await this.message
			let yesBt = await document.getElementById('confirmYesBt')
			let noBt = await document.getElementById('confirmNoBt')
			return new Promise((res) => {
				yesBt.onclick = () => {
					this.showing = false
					res(true)
				}

				noBt.onclick = () => {
					this.showing = false
					res(false)
				}
			})
		}
	}
}
</script>

<style scoped>
#confirmContainer {
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
	background: #0000004d;
}
#confirmDiv {
	margin: auto;
	z-index: 1;
	width: 80%;
	height: fit-content;
	max-height: 80%;
	box-sizing: border-box;
	border-radius: 0.3rem;
	box-shadow: 0 0 10px #0000004d;
}
#confirmHeader {
	background: #202020;
	padding: 8px 14px;
	text-align: left;
	border-radius: 0.4rem 0.4rem 0 0;
	font-weight: bolder;
}
#confirmBody {
	background: #303030;
	padding: 20px 8px;
	box-sizing: border-box;
	max-height: calc(100vh - 190px);
	overflow-y: auto;
}
#confirmFooter {
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

#confirmYesBt {
	background: #ff5555;
	border-radius: 0 0 0 0.3rem;
	transform-origin: right;
}

#confirmYesBt:active {
	transform: rotateY(10deg);
}

#confirmNoBt {
	background: #ff954e;
	border-radius: 0 0 0.3rem 0;
	transform-origin: left;
}

#confirmNoBt:active {
	transform: rotateY(-10deg);
}
</style>