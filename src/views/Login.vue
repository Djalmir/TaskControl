<template>
	<div id="body">
		<div id="container">
			<div id="welcomeMsg">
				<h1>Boas vindas!</h1>
				<p>
					Faça login em sua conta
					<b>Razion</b> para começar a organizar suas listas like a boss!
				</p>
			</div>
			<div id="loginFormOuter">
				<div id="loginForm">
					<p class="textInputOuter">
						<label for="emailInput" class="textInputLabel" :class="{'textInputLabelEmpty':email==''&&activeElementId!='emailInput'}">Email</label>
						<input type="email" name="emailInput" id="emailInput" class="textInputInner" v-model="email" @blur="activeElementId=null"/>
					</p>
					<p class="textInputOuter">
						<label for="passwordInput" class="textInputLabel" :class="{'textInputLabelEmpty':password==''&&activeElementId!='passwordInput'}">Senha</label>
						<input type="password" name="passwordInput" id="passwordInput" class="textInputInner" v-model="password" @blur="activeElementId=null"/>
					</p>
					<button class="greenBt" id="loginBt" @click="login">Entrar</button>
				</div>
				<p>
					Ainda não tem um cadastro? <br/>
					<router-link to="/signup">Clique aqui</router-link> e cadastre-se gratuitamente! 
				</p>
			</div>			
		</div>
	</div>
</template>

<script>
import Axios from '../services/Axios'
export default {
	name: 'Login',
	data() {
		return {
			email: '',
			password: '',
			activeElementId: null
		}
	},
	mounted() {
		document.addEventListener('focusin', () => {
			this.activeElementId = document.activeElement.id
		})
	},
	methods:{
		login(){
			if (this.email.trim() == '')
				alert('Informe seu email')
			else if (this.password.trim() == '')
				alert('Digite uma senha')
			else{
				Axios.login({
					email:this.email,
					password:this.password
				})
					.then((res)=>{
						console.log(res.data.user)
						// alert('Login efetuado! Agora precisa setar o usuário na store e redirecionar.')
						this.$store.dispatch('session/setUser', res.data.user)
						this.$store.dispatch('goTo','/home')
					})
					.catch((err)=>{
						console.log(err)
					})
			}
		}
	}
}
</script>

<style scoped>
a{
	color: #fff;
	font-weight: bolder;
}

#body {
	position: absolute;
	width: 100%;
	min-height: 100%;
	box-sizing: content-box;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	letter-spacing: 1px;
}

#container {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: flex-start;
	width: 90%;
	max-width: 1024px;
	padding-bottom: 40px;
}

#welcomeMsg {
	flex: 1;
	min-width: 300px;
	margin: 10px;
	padding: 0 20px;
	box-sizing: border-box;
}

#welcomeMsg h1 {
	margin: 30px 0 0;
}

#loginFormOuter {
	flex: 1;
	min-width: 300px;
	margin: 10px;
}

#loginForm {
	background: #303030;
	padding: .1px 20px;
	box-sizing: border-box;
	border-radius: .4rem;
	box-shadow: 0 0 5px #0000004d;
}

#loginBt{
	margin: 0 0 30px;
	width: 100%;
}

@media (min-width: 712px) {
	#welcomeMsg {
		text-align: right;
	}
}
</style>