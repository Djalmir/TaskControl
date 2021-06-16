<template>
	<div id="body">
		<div id="container">
			<div id="welcomeMsg">
				<h1>Uma conta. Todas as vantagens!</h1>
				<p>
					Com uma única conta você terá acesso a todos os produtos oferecidos pela
					<b>Razion</b> de graça!
				</p>
			</div>
			<div id="signupFormOuter">
				<div id="signupForm">
					<p class="textInputOuter">
						<label for="nameInput" class="textInputLabel" :class="{'textInputLabelEmpty':name==''&&activeElementId!='nameInput'}">Nome</label>
						<input type="text" name="nameInput" id="nameInput" class="textInputInner" @keydown.enter="signUp" v-model="name" @blur="activeElementId=null" />
					</p>
					<p class="textInputOuter">
						<label for="emailInput" class="textInputLabel" :class="{'textInputLabelEmpty':email==''&&activeElementId!='emailInput'}">Email</label>
						<input type="email" name="emailInput" id="emailInput" class="textInputInner" @keydown.enter="signUp" v-model="email" @blur="activeElementId=null" />
					</p>
					<p class="textInputOuter">
						<label for="passwordInput" class="textInputLabel" :class="{'textInputLabelEmpty':password==''&&activeElementId!='passwordInput'}">Senha</label>
						<input type="password" name="passwordInput" id="passwordInput" class="textInputInner" @keydown.enter="signUp" v-model="password" @blur="activeElementId=null" />
					</p>
					<p class="textInputOuter">
						<label for="confirmPasswordInput" class="textInputLabel" :class="{'textInputLabelEmpty':confirmPassword==''&&activeElementId!='confirmPasswordInput'}">Confirme a senha</label>
						<input type="password" name="confirmPasswordInput" id="confirmPasswordInput" class="textInputInner" @keydown.enter="signUp" v-model="confirmPassword" @blur="activeElementId=null" />
					</p>
					<button class="greenBt" id="signupBt" @click="signUp">Cadastrar</button>
				</div>
				<p>
					Já tem um cadastro?
					<br />
					<router-link to="/">Fazer Login</router-link>
				</p>
			</div>
		</div>
		<Message ref="Message" />
	</div>
</template>

<script>
import Message from '../components/Message'
import Axios from '../services/Axios'
export default {
	name: 'Signup',
	data() {
		return {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			activeElementId: null
		}
	},
	components:{
		Message
	},
	mounted() {
		document.addEventListener('focusin', () => {
			this.activeElementId = document.activeElement.id
		})
	},
	methods: {
		signUp() {
			if (this.name.trim() == '')
				this.$refs.Message.show('Por favor', 'Informe seu nome')
			else if (this.email.trim() == '')
				this.$refs.Message.show('Por favor', 'Informe seu email')
			else if (this.password.trim() == '')
				this.$refs.Message.show('Por favor', 'Digite uma senha')
			else if (this.confirmPassword.trim() == '')
				this.$refs.Message.show('Por favor', 'Confirme a senha')
			else if (this.password != this.confirmPassword)
				this.$refs.Message.show('Por favor', 'As senhas não coincidem')
			else {
				Axios.signUp({
					name: this.name,
					email: this.email,
					password: this.password
				})
					.then(()=>{
						// console.log(res.data)
						this.$refs.Message.show('', 'Usuário cadastrado com sucesso!')
					})
			}
		}
	}
}
</script>

<style scoped>
a {
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

#signupFormOuter {
	flex: 1;
	min-width: 300px;
	margin: 10px;
}

#signupForm {
	background: #303030;
	padding: 0.1px 20px;
	box-sizing: border-box;
	border-radius: 0.4rem;
	box-shadow: 0 0 5px #0000004d;
}

#signupBt {
	margin: 0 0 30px;
	width: 100%;
}

@media (min-width: 712px) {
	#welcomeMsg {
		text-align: right;
	}
}
</style>