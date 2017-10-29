<template id="login">
  <v-card align-center class="login mt-5 elevation-10">
    <v-container class="login">
      <h4>AAR Framework</h4>
      <v-form v-model="valid" ref="form">
        <div class="mx-2">
          <v-text-field label="Username" name="Username" v-model="input.username" :error-messages="errors.collect('Username')" v-validate="'required'">
          </v-text-field>
          <v-text-field label="Password" name="Password" v-model="input.password" :error-messages="errors.collect('Password')" type="password" v-validate="'required'">
          </v-text-field>
          <v-alert error :value="message.error">
            {{message.error}}
          </v-alert>
        </div>
        <div class="mt-3">
          <v-btn primary @click="submit()">Login</v-btn>
        </div>
      </v-form>
    </v-container>
  </v-card>
</template>


<script>
import auth from "../../auth";

export default {
  data() {
    return {
      error: null,
      input: {
        username: "",
        password: "",
        errorMessage: ""
      },
      message: {
        error: ""
      }
    };
  },
  computed: {},
  methods: {
    submit() {
      this.$validator.validateAll();
      this.message.error = "";
      if (!this.errors.any()) {
        this.$http
          .post("login", {
            username: this.input.username,
            password: this.input.password
          })
          .then(response => {
            if (response.data.success_message) {
              localStorage.setItem("token", response.data.jwt);
              auth.user.authenticated = true;
              window.location.reload();
              this.$router.push("/");
            } else {
              this.message.error = "Invalid username and password";
            }
          })
          .catch(function(error) {
            console.log(error);
          });
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
