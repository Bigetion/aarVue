<template lang="html">
  <v-tabs id="mobile-tabs-5" fixed light centered>
    <v-toolbar class="grey lighten-3" light flat>
      <v-toolbar-title>Tags</v-toolbar-title>
    </v-toolbar>
    <v-layout row wrap class="grey lighten-3 mt-2">
      <v-flex md4>
        <v-card class="mx-2 my-2">
          <v-toolbar flat dense class="white">
            <v-toolbar-title class="text-xs-center">{{state.isEdit ? "Edit":"Add New"}} Tag</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <v-form v-model="valid" ref="form">
            <div class="mx-2">
            <v-text-field label="Name" name="name" v-model="input.name" :error-messages="errors.collect('name')" v-validate="'required'"></v-text-field>
            <v-text-field label="Description" name="description" v-model="input.description" :error-messages="errors.collect('description')" multi-line></v-text-field>
            </div>
            <div class="mt-3">
              <v-btn primary @click="submit()">{{state.isEdit ? "Save":"Add"}}</v-btn>
              <v-btn error v-if="state.isEdit" @click="isEditClick(false)">Cancel</v-btn>
            </div>
          </v-form>
        </v-card>
      </v-flex>
      <v-flex md8>
        <v-card class="mx-2 my-2">
          <v-data-table flat v-bind:headers="columns" :items="tagList" hide-actions class="elevation-1">
            <template slot="items" scope="props">
              <td>{{ props.item.text }}</td>
              <td>{{ props.item.description }}</td>
              <td width="150">
                <v-btn icon small class="teal--text" v-on:click.stop="isEditClick(true, props.item)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn icon small class="red--text" @click="deleteClick(props.item)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-tabs>
</template>

<script>
var slugify = require("slugify");
export default {
  data() {
    return {
      state: {
        isEdit: false
      },
      input: {
        
      },
      columns: [
        { text: "Tag Name", value: "text", align: "left" },
        { text: "Description", value: "description", align: "left" },
        { text: "Action", align: "left", sortable: false }
      ],
      tagList: []
    };
  },
  methods: {
    getData() {
      this.$http.post("terms/getData", { type: "tag" }).then(response => {
        if (!response.data.error_message) {
          this.tagList = response.data.data;
        }
      });
    },
    isEditClick(condition, row) {
      this.$validator.reset();
      this.errors.clear();
      this.state.isEdit = condition;
      if (condition) {
        this.input = {
          id: row.id,
          taxonomyId: row.taxonomy_id,
          name: row.text,
          description: row.description
        };
      } else {
        this.input = {
          id: "",
          taxonomyId: "",
          name: "",
          description: ""
        };
      }
    },
    deleteClick(row) {
      this.$modal
        .confirm({
          message: "Are you sure you want to delete?"
        })
        .then(response => {
          this.$http
            .post("terms/submitDelete", {
              id: row.id,
              taxonomyId: row.taxonomy_id
            })
            .then(response => {
              if (response.data.success_message) {
                this.getData();
              }
            });
        })
        .catch(error => {});
    },
    submit() {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        if (this.state.isEdit) {
          this.$http
            .post("terms/submitEdit", {
              id: this.input.id,
              taxonomyId: this.input.taxonomyId,
              name: this.input.name,
              slug: slugify(this.input.name, {
                remove: null,
                lower: true
              }),
              description: this.input.description
            })
            .then(response => {
              if (response.data.success_message) {
                this.isEditClick(false);
                this.getData();
              }
            });
        } else {
          this.$http
            .post("terms/submitAdd", {
              name: this.input.name,
              slug: slugify(this.input.name, {
                remove: null,
                lower: true
              }),
              description: this.input.description
            })
            .then(response => {
              if (response.data.success_message) {
                this.isEditClick(false);
                this.getData();
              }
            });
        }
      }
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="css">

</style>
