<template id="login">
  <v-card align-center class="login">
    <v-container class="login">
      <h4>AAR Framework</h4>
      <v-form v-model="valid" ref="form">
        <div class="mx-2">
          <v-text-field label="Username" name="username" v-model="input.username" :error-messages="errors.collect('username')" v-validate="'required'">
          </v-text-field>
          <v-text-field label="Password" name="password" v-model="input.password" :error-messages="errors.collect('password')" type="password" v-validate="'required'">
          </v-text-field>
        </div>
        <div class="mt-3">
          <v-btn primary @click="submit()">Login</v-btn>
        </div>
      </v-form>
    </v-container>
  </v-card>
</template>


<script>
import auth from '../../auth'

export default {
  data() {
    return {
      error: null,
      input: {
        username: '',
        password: ''
      }
    };
  },
  computed: {},
  methods: {
    submit() {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        this.$http.post('login', {
          username: this.input.username,
          password: this.input.password
        })
          .then(response => {
            if (response.data.success_message) {
              localStorage.setItem('token', response.data.jwt);
              auth.user.authenticated = true;
              window.location.reload();
              this.$router.push('/');
            }
          })
          .catch(function(error) {
            console.log(error);
          })
      }
    }
  },
  components: {}
};
</script>

<style lang="css">
.login {
  max-width: 400px;
  margin: 0 auto;
}
</style>
