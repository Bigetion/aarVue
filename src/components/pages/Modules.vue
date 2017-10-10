<template>
  <v-tabs id="mobile-tabs-5" fixed light centered>
    <v-toolbar class="grey lighten-3" light flat>
      <v-toolbar-title>Modules</v-toolbar-title>
    </v-toolbar>
    <v-card flat dense class="grey lighten-3 mt-2">
      <v-layout row wrap>
        <v-flex md4 sm4 v-for="item in moduleList" v-bind:key="item.name">
          <v-card class="mx-2 my-2">
            <v-toolbar flat class="white" dense>
              <v-toolbar-title class="text-xs-center">Module : {{item.name}}</v-toolbar-title>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list dense subheader class="white">
              <v-list-tile avatar @click="" v-for="childItem in item.controller" v-bind:key="childItem">
                <v-list-tile-content>
                  <v-list-tile-title>
                    Controller_{{childItem}}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
  </v-tabs>
</template>

<script>
export default {
  data() {
    return {
      moduleList: []
    };
  },
  methods: {

  },
  created() {
    this.$http.post('app/getModules')
      .then(response => {
        if (!response.data.error_message) {
          for (let item in response.data) {
            let newItem = {
              'name': item,
              'controller': response.data[item]
            }
            this.moduleList.push(newItem);
          }
        }
      })
  }
};
</script>

<style lang="css">

</style>
