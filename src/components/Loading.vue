<template>
	<transition name="fade">
		<div id="loadingContainer" v-if="loading">
			<div id="shadow"></div>
			<img src="../assets/loading.svg"/>
		</div>
	</transition>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		name:'Loading',
		computed:{
			...mapState(['loading'])
		}
	}
</script>

<style scoped>
	#loadingContainer{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 5;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	#shadow{
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		background: #000000d4;
	}
	
	img{
		z-index: 2;
		width: 50px;
	}
	
	.fade-enter-active{
		animation: fade linear .5s;
	}
	
	.fade-leave-active{
		animation: fade linear .5s reverse;
	}
	
	@keyframes fade {
		from{
			opacity: 0;
		}
		to{
			opacity: 1;
		}
	}
</style>