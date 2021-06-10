<template>
	<div id="body">
		<div id="welcomeMsg">
			<h1>Boas vindas!</h1>
			<p>Faça login em sua conta <b>Razion</b> para começar a organizar suas listas like a boss!</p>
		</div>
		<div id="loginForm">
			<b>Login</b>
			<p class="textInputOuter">
				<label for="emailInput" class="textInputLabel" :class="{'textInputLabelEmpty':email==''&&activeElementId!='emailInput'}">Email</label>
				<input type="email" name="emailInput" id="emailInput" class="textInputInner" v-model="email" />
			</p>
			<p class="textInputOuter">
				<label for="passwordInput" class="textInputLabel" :class="{'textInputLabelEmpty':password==''&&activeElementId!='passwordInput'}">Senha</label>
				<input type="password" name="passwordInput" id="passwordInput" class="textInputInner" v-model="password" />
			</p>
		</div>
		
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data(){
			return {
				email:'',
				password:'',
				activeElementId:null
			}
		},
		mounted() {
			document.addEventListener('focusin',()=>{
				this.activeElementId = document.activeElement.id
			})		
		}
	}
</script>

<style scoped>
	#body{
		
	}
	
	#welcomeMsg{
		
	}
	
	#loginForm{
		
	}
</style>