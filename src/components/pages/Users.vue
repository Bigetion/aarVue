<template lang="html">
  <v-tabs id="mobile-tabs-5" fixed light centered>
    <v-toolbar class="grey lighten-3" light flat>
      <v-toolbar-title>Users</v-toolbar-title>
      <v-fab-transition>
        <v-btn class="blue" fab dark small absolute right v-on:click.stop="isAddClick(true)">
          <v-icon>add</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-toolbar>
    <v-card flat class="grey lighten-3 mt-2 py-2 px-2">
      <v-data-table flat v-bind:headers="columns" :items="userList" hide-actions class="elevation-1">
        <template slot="items" scope="props">
          <td>{{ props.item.username }}</td>
          <td>{{ props.item.role_name }}</td>
          <td width="150">
            <v-btn icon small class="teal--text" v-on:click.stop="isEditClick(true, props.item)">
              <v-icon>edit</v-icon>
            </v-btn>
            
            <v-btn v-if="props.item.id_user!=1 && props.item.id_user!=2" icon small class="pink--text" @click="deleteClick(props.item)">
              <v-icon>delete</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="state.openDialog" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark class="primary">
          <v-toolbar-title>{{state.isAdd ? 'Add':'Edit'}} User</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="state.openDialog = false" dark>
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form v-model="valid" ref="form" class="pa-4">
          <div class="mx-2">
            <v-text-field label="Username" name="username" v-model="input.username" :error-messages="errors.collect('username')" v-validate="'required'"></v-text-field>
            <v-select label="Role" name="role" v-model="input.idRole" v-bind:items="roleList" :error-messages="errors.collect('role')" v-validate="'required'" item-text="role_name" item-value="id_role" :disabled="input.idRole==1 || input.idRole==2"></v-select>
          </div>
          <div class="mt-3">
            <v-btn primary @click="submit()">Save</v-btn>
            <v-btn error @click.native="state.openDialog = false">Cancel</v-btn>
          </div>
      </v-form>
        </v-list>
      </v-card>
    </v-dialog>
  </v-tabs>
</template>

<script>
export default {
  data() {
    return {
      state: {
        isAdd: false,
        isEdit: false,
        openDialog: false
      },
      input: {
        idUser: '',
        username: '',
        idRole: ''
      },
      columns: [
        { text: 'Username', value: 'username', align: 'left' },
        { text: 'Role Name', value: 'role_name', align: 'left' },
        { text: 'Action', align: 'left', sortable: false, maxWidth: '80px' }
      ],
      roleList: [],
      userList: []
    };
  },
  methods: {
    getUserData() {
      this.$http.post('users/getData')
        .then(response => {
          if (!response.data.error_message) {
            this.userList = response.data.data
          }
        })
    },
    getRoleData() {
      this.$http.post('roles/getData')
        .then(response => {
          if (!response.data.error_message) {
            this.roleList = response.data.data
          }
        })
    },
    isAddClick(condition) {
      this.state.isAdd = condition
      this.state.openDialog = condition
      if (condition) {
        this.$validator.clean()
        this.errors.clear()
        this.input = {
          username: '',
          idRole: ''
        }
      }
    },
    isEditClick(condition, row) {
      this.state.isEdit = condition
      this.state.openDialog = condition
      if (condition) {
        this.input = {
          idUser: row.id_user,
          username: row.username,
          idRole: row.id_role
        }
      }
    },
    deleteClick(row) {
      this.$modal.confirm({
        message: 'Are you sure you want to delete?'
      }).then(response => {
        this.$http.post('users/submitDelete', {
          idUser: row.id_user
        }).then(response => {
          if (response.data.success_message) {
            this.getUserData()
          }
        })
      }).catch(error => { })
    },
    submit() {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        if (this.state.isAdd) {
          this.$http.post('users/submitAdd', {
            userName: this.input.username,
            idRole: this.input.idRole
          }).then(response => {
            if (response.data.success_message) {
              this.isAddClick(false)
              this.getUserData()
            }
          })
        }

        if (this.state.isEdit) {
          this.$http.post('users/submitEdit', {
            idUser: this.input.idUser,
            userName: this.input.username,
            idRole: this.input.idRole
          }).then(response => {
            if (response.data.success_message) {
              this.isEditClick(false)
              this.getUserData()
            }
          })
        }
      }
    }
  },
  created() {
    this.getUserData()
    this.getRoleData()
  }
};
</script>

<style lang="css">

</style>
