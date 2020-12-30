<template>
	<div style="margin-top:100px;">
		<BaseAddButton />
		<h1 v-if="list">{{list.name}}</h1>
	</div>
</template>

<script>
import {mapState} from 'vuex'
export default {
	computed:{
		...mapState['list']
	}
}
</script>

<style scoped>
	
</style>