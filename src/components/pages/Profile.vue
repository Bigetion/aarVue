<template lang="html">
  <v-tabs id="mobile-tabs-5" fixed light centered>
    <v-toolbar class="grey lighten-3" light flat>
      <v-toolbar-title>My Profile</v-toolbar-title>
    </v-toolbar>
    <v-layout row wrap class="grey lighten-3 mt-2">
      <v-flex md4>
        <v-card class="mx-2 my-2 pa-2">
          <v-text-field label="Username" v-model="userInfo.name" :disabled="true"></v-text-field>
          <v-text-field label="Role Name" v-model="userInfo.role" :disabled="true"></v-text-field>
        </v-card>
      </v-flex>
      <v-flex md8>
        <div class="my-2 px-2">
          <v-alert success :value="message.success">
            {{message.success}}
          </v-alert>
          <v-alert error :value="message.error">
            {{message.error}}
          </v-alert>
        </div>
        <v-card class="mx-2 my-2">
          <v-toolbar flat class="white" dense>
            <v-toolbar-title class="text-xs-center">Change Password</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-form v-model="valid" ref="form" class="pa-2">
            <div class="mx-2">
              <v-text-field label="Old Password" name="Old Password" v-model="input.passwordOld" :error-messages="errors.collect('Old Password')" type="password" v-validate="'required'"></v-text-field>
              <v-text-field label="New Password" name="New Password" v-model="input.passwordNew" :error-messages="errors.collect('New Password')" type="password" v-validate="'required'"></v-text-field>
              <v-text-field label="Confirm New Password" name="Confirm New Password" v-model="input.passwordNewConfirm" :error-messages="errors.collect('Confirm New Password')" type="password" v-validate="{required: true, confirmed:input.passwordNew}"></v-text-field>
            </div>
            <div class="mt-3">
              <v-btn primary @click="submit()">Save New Password</v-btn>
            </div>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-tabs>
</template>

<script>
export default {
  data() {
    return {
      error: null,
      input: {
        passwordOld: "",
        passwordNew: "",
        passwordNewConfirm: ""
      },
      message: {
        success: "",
        error: ""
      },
      userInfo: {
        name: "Admin",
        role: "Administrator"
      }
    };
  },
  computed: {},
  methods: {
    submit() {
      this.$validator.validateAll();
      this.message = {
        success: "",
        error: ""
      };
      if (!this.errors.any()) {
        this.$http
          .post("app/changePassword", {
            passwordOld: this.input.passwordOld,
            passwordNew: this.input.passwordNew
          })
          .then(response => {
            if (response.data.success_message) {
              this.input = {
                passwordOld: "",
                passwordNew: "",
                passwordNewConfirm: ""
              };
              this.$validator.reset();
              this.errors.clear();
              this.message.success = "Password successfully changed";
            } else {
              this.message.error = "The password that you entered is not valid";
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

</style>
