<template>
	<svg viewBox="0 0 32 22" xmlns="http://www.w3.org/2000/svg">
		<text x="16" y="11">
			{{ imgTxt }}
		</text>
	</svg>
</template>

<script>
export default {
	props: ['list'],
	data() {
		return {
			imgTxt: ''
		}
	},
	mounted() {
		let nameArray = this.list.name.split(' ')
		let a = nameArray[0][0].toUpperCase()
		let b = ''
		if (nameArray.length > 1) b = nameArray[1][0].toUpperCase()
		this.imgTxt = a + b
	}
}
</script>

<style scoped>
text {
	text-anchor: middle;
	dominant-baseline: central;
	fill: #202020;
	stroke: #bdbdbd;
	stroke-width: 0.2;
	font-size: 20px;
	font-weight: bolder;
	/* text-shadow: 0 0 20px #002da8; */
}
</style>
