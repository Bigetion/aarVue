<template lang="html">
  <v-tabs id="mobile-tabs-5" fixed light centered>
    <v-toolbar class="grey lighten-3" light flat>
      <v-toolbar-title>All Posts</v-toolbar-title>
      <v-fab-transition>
        <v-btn class="blue" fab dark small absolute right v-on:click.stop="isAddClick(true)">
          <v-icon>add</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-toolbar>
    <v-card flat class="grey lighten-3 mt-2">
      <v-layout>
          <v-flex xs12 sm6 md4 class="pa-2" v-for="item in postList">
            <v-card>
              <v-card-media :src="baseUrl+'image/get/12341'" height="200px">
              </v-card-media>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">{{item.post_title}}</h3>
                  <div>{{item.description}}</div>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn flat color="orange">Edit</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
      </v-layout>
      <v-dialog v-model="state.openDialog" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark class="primary">
          <v-toolbar-title>{{state.isAdd ? 'Add':'Edit'}} Post</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="state.openDialog = false" dark>
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container fluid grid-list-md>
          <v-form v-model="valid" ref="form" class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 sm8 md9>
                  <div class="mx-2">
                    <v-text-field label="Title" name="Title" v-model="input.title" :error-messages="errors.collect('Title')" v-validate="'required'" class="mb-4"></v-text-field>
                    <froala :tag="'textarea'" :config="config" v-model="input.content" name="Content" :error-messages="errors.collect('Content')" v-validate="'required'"></froala>
                    <v-text-field textarea label="Description" name="Description" v-model="input.description" :error-messages="errors.collect('Description')" v-validate="'required'" multi-line></v-text-field>
                  </div>
            </v-flex>
            <v-flex xs12 sm4 md3>
              <v-card flat>
                <div class="mx-2">
                <v-select label="Categories" v-bind:items="categoryList" v-model="categories" multiple chips persistent-hint class="mb-2"></v-select>
                <v-select label="Tags" v-bind:items="tagList" v-model="tags" tags chips class="mb-4"></v-select>
                </div>
                <v-card-media src="/static/doc-images/cards/desert.jpg" height="200px" v-if="false">
                </v-card-media>
                <v-card-actions>
                  <v-btn class="blue--text" @click="featuredImageClick()">Set featured image</v-btn>
                  <v-btn class="orange--text" v-if="false">Remove featured image</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <div class="mt-3">
                  <v-btn primary @click="submit()">Save</v-btn>
                  <v-btn error @click.native="state.openDialog = false">Cancel</v-btn>
                </div>
            </v-flex>
          </v-layout>
          </v-form>
        </v-container>
        </v-list>
      </v-card>
    </v-dialog>
    </v-card>
  </v-tabs>
</template>

<script>
import VueFroala from "vue-froala-wysiwyg";
import auth from "../../auth";
import froala from "../../froala";
export default {
  name: "app",
  data() {
    return {
      state: {
        isAdd: false,
        isEdit: false,
        openDialog: false
      },
      config: froala.config,
      input: {
        title: "",
        content: "",
        description: "",
        featuredImage: ""
      },
      postList: [],
      categories: [],
      categoryList: [],
      tags: [],
      tagList: [],
      baseUrl: process.env.API_URL
    };
  },
  methods: {
    getData() {
      this.$http.post("posts/getData").then(response => {
        if (!response.data.error_message) {
          this.postList = response.data.data;
        }
      });
    },
    getCategories() {
      this.$http
        .post("terms/getData", {
          type: "category"
        })
        .then(response => {
          if (!response.data.error_message) {
            this.categoryList = response.data.data;
          }
        });
    },
    getTags() {
      this.$http
        .post("terms/getData", {
          type: "tag"
        })
        .then(response => {
          if (!response.data.error_message) {
            this.tagList = response.data.data;
          }
        });
    },
    isAddClick(condition) {
      this.state.isAdd = condition;
      this.state.openDialog = condition;
      if (condition) {
        this.$validator.reset();
        this.errors.clear();
        this.input = {
          title: "",
          content: "",
          description: "",
          featuredImage: ""
        };
      }
    },
    isEditClick(condition, row) {
      this.state.isEdit = condition;
      this.state.openDialog = condition;
      if (condition) {
        this.input = {
          title: "",
          content: "",
          description: "",
          featuredImage: ""
        };
      }
    },
    featuredImageClick() {
      this.$modal
        .setFeaturedImage()
        .then(response => {})
        .catch(rejected => {});
    },
    submit() {
      this.$validator.validateAll();
      if (!this.errors.any()) {
        if (this.state.isAdd) {
        }

        if (this.state.isEdit) {
        }
      }
    }
  },
  created() {
    this.getData();
    this.getCategories();
    this.getTags();
  }
};
</script>

<style lang="css">

</style>
