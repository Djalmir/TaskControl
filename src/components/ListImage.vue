<template>
	<svg viewBox="0 0 32 22" xmlns="http://www.w3.org/2000/svg">
		<text x="16" y="11">
			{{ txt }}
		</text>
	</svg>
</template>

<script>
export default {
	props: ['txt']
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
	text-shadow: 0 0 20px #002da8;
}
</style>
