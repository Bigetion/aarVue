<template lang="html">
  <v-tabs id="mobile-tabs-5" fixed light centered>
    <v-toolbar class="grey lighten-3" light flat>
      <v-toolbar-title>Permissions</v-toolbar-title>
    </v-toolbar>
    <v-card flat class="grey lighten-3 mt-2 pa-2">
      <v-data-table flat v-bind:headers="columns" :items="functionList" hide-actions class="elevation-1">
        <template slot="items" scope="props">
          <td>{{ props.item.path }}</td>
          <td v-for="role in roleList" v-bind::key="role.id_role">
            <div class="text-xs-right">
              <v-checkbox :disabled="role.id_role==1" class="ml-2" :input-value="props.item[role.id_role]" light v-on:click="updatePermissions(props, role.id_role)"></v-checkbox>
            </div>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-tabs>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { text: 'Permission Access', value: 'path', align: 'left', sortable: false }
      ],
      roleList: [],
      moduleList: [],
      functionList: [],
      functionModel: {}
    }
  },
  methods: {
    updatePermissions(props, idRole) {
      if (idRole != 1) {
        var index = _.findIndex(this.functionList, function(o) { return o.path == props.item.path })
        this.functionList[index][idRole] = !this.functionList[index][idRole]
        this.functionModel[idRole][props.item.path] = this.functionList[index][idRole]
        this.functionList = this.functionList.slice()

        let permissions = {}
        for (let key in this.functionModel) {
          let item = this.functionModel[key]
          permissions[key] = []
          for (let key2 in this.functionModel[key]) {
            let item2 = this.functionModel[key][key2]
            if (item2) {
              permissions[key].push(key2)
            }
          }
          permissions[key] = permissions[key].join('---')
        }
        this.$http.post('permissions/updatePermissions', {
          permissions: permissions
        })
      }
    }
  },
  created() {
    this.$http.post('permissions/getPermissions')
      .then(response => {
        if (!response.data.error_message) {
          let moduleList = []
          response.data.project.forEach((module) => {
            response.data.controller[module].forEach((controller) => {
              let newModule = {
                moduleName: module,
                controllerName: controller,
                functionList: response.data.function[controller]
              }
              moduleList.push(newModule)

              newModule.functionList.forEach((functionName) => {
                this.functionList.push({
                  path: module + '.' + controller + '.' + functionName
                })
              })
            })
          })
          this.moduleList = moduleList
          let roleList = []
          response.data.data.forEach((item) => {
            if (item.permission != null) item.permission = item.permission.split('---')
            else item.permission = []

            let columnItem = {
              text: item.role_name,
              value: item.id_role,
              align: 'center',
              sortable: false
            }
            this.columns.push(columnItem)

            let roleItem = {
              id_role: item.id_role,
              role_name: item.role_name
            }
            roleList.push(roleItem)

            this.functionModel[item.id_role] = {}

            this.moduleList.forEach((moduleListItem) => {
              moduleListItem.functionList.forEach((functionListItem) => {
                this.functionModel[item.id_role][moduleListItem.moduleName + '.' + moduleListItem.controllerName + '.' + functionListItem] = item.id_role == '1' || _.findIndex(item.permission, function(o) {
                  return o == (moduleListItem.moduleName + '.' + moduleListItem.controllerName + '.' + functionListItem)
                }) > -1
              })
            })
          })
          this.roleList = roleList

          this.functionList.forEach((item) => {
            this.roleList.forEach((item2) => {
              item[item2.id_role] = this.functionModel[item2.id_role][item.path]
            })
          })
        }
      })
  }
}
</script>

<style lang="css">

</style>
