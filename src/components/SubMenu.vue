<template>
	<transition name="grow">
		<div class="subMenu" v-if="showingSubMenu == item.id">
			<button :class="{ deleteBtn: !renaming, cancelBtn: renaming }" @click="$emit('delOrCancel', item)">
				<img :src="require('../assets/trash.svg')" v-if="!renaming" />
				<img :src="require('../assets/cancel.svg')" v-else />
			</button>
			<button :class="{ renameBtn: !renaming, saveBtn: renaming }" @click="$emit('renameOrSave', item)">
				<img :src="require('../assets/edit.svg')" v-if="!renaming" />
				<img :src="require('../assets/done.svg')" v-else />
			</button>
		</div>
	</transition>
</template>

<script>
import {mapState} from 'vuex'
export default {
	props: {
		item: {
			type: Object,
			required: true
		}
	},
	computed: {
		...mapState(['showingSubMenu', 'renaming'])
	}
}
</script>

<style scoped>
.subMenu {
	display: flex;
	transform-origin: top;
}

.subMenu button {
	border: 1px solid #303030;
	flex: 1;
	height: 40px;
	outline: none;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
}

.deleteBtn {
	border-radius: 0 0 0 0.2rem;
	background-color: #ff5555;
}

.cancelBtn {
	border-radius: 0 0 0 0.2rem;
	background-color: #ff954e;
}

.renameBtn {
	border-radius: 0 0 0.2rem 0;
	background-color: #f5ff67;
}

.saveBtn {
	border-radius: 0 0 0.2rem 0;
	background-color: #c2ff7c;
}

.subMenu button:active img {
	transform: scale(0.8);
}

.subMenu img {
	height: 22px;
	transition: 0.2s;
}

.grow-enter-active {
	animation: grow linear 0.1s 1;
}

.grow-leave-active {
	animation: grow reverse linear 0.1s 1;
}

@keyframes grow {
	0% {
		height: 0;
	}
	100% {
		height: 40px;
	}
}
</style>
