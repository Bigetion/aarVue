<template>
  <v-tabs id="mobile-tabs-5" fixed light centered>
    <v-toolbar class="grey lighten-3" light flat>
      <v-toolbar-title>Roles</v-toolbar-title>
      <v-fab-transition>
        <v-btn class="blue" fab dark small absolute right v-on:click.stop="isAddClick(true)">
          <v-icon>add</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-toolbar>
    <v-card flat class="grey lighten-3 mt-2 py-2 px-2">
      <v-data-table flat v-bind:headers="columns" :items="roleList" hide-actions class="elevation-1">
        <template slot="items" scope="props">
          <td>{{ props.item.role_name }}</td>
          <td>{{ props.item.description }}</td>
          <td width="150">
            <v-btn icon small class="teal--text">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn v-if="props.item.id_role!=1 && props.item.id_role!=2" icon small class="red--text" @click="deleteClick(props.item)">
              <v-icon>delete</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="state.isAdd" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark class="primary">
          <v-toolbar-title>Add Role</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="state.isAdd = false" dark>
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form v-model="valid" ref="form" class="pa-4">
          <div class="mx-2">
          <v-text-field label="Role Name" name="roleName" v-model="input.roleName" :error-messages="errors.collect('roleName')" v-validate="'required'"></v-text-field>
          <v-text-field label="Description" name="description" v-model="input.description" :error-messages="errors.collect('description')" v-validate="'required'" multi-line></v-text-field>
          </div>
          <div class="mt-3">
            <v-btn primary @click="submit()">Save</v-btn>
            <v-btn error @click.native="state.isAdd = false">Cancel</v-btn>
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
        isEdit: false
      },
      input: {
        roleName: '',
        description: ''
      },
      columns: [
        { text: 'Role Name', value: 'role_name', align: 'left' },
        { text: 'Description', value: 'description', align: 'left' },
        { text: 'Action', align: 'left', sortable: false }
      ],
      roleList: []
    };
  },
  methods: {
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

      if (condition) {
        this.$validator.clean()
        this.errors.clear()
        this.input = {
          roleName: '',
          description: ''
        }
      }
    },
    isEditClick(condition) {
      this.state.isEdit = condition
    },
    deleteClick(row) {
      this.$modal.confirm({
        message: 'Are you sure you want to delete?'
      }).then(response => {
        this.$http.post('roles/submitDelete', {
          idRole: row.id_role
        }).then(response => {
          if (response.data.success_message) {
            this.getRoleData()
          }
        })
      }).catch(error => { })
    },
    submit() {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        if (this.state.isAdd) {
          this.$http.post('roles/submitAdd', this.input).then(response => {
            if (response.data.success_message) {
              this.state.isAdd = false
              this.getRoleData()
            }
          })
        }

        if (this.state.isEdit) {

        }
      }
    }
  },
  created() {
    this.getRoleData()
  }
};
</script>

<style lang="css">

</style>
