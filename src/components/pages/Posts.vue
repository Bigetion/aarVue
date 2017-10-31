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
      <v-layout row wrap>
          <v-flex xs12 sm12 md6 class="pa-2" v-for="item in postList">
            <v-card>
              <v-card-media :src="baseUrl+'image/get/featured/thumbs/'+item.thumbnail" height="200px">
                <v-fab-transition>
                  <v-btn @click="featuredImageClick(item)" class="grey" fab dark small absolute bottom right style="margin-bottom:30px;margin-right:-5px">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </v-fab-transition>
              </v-card-media>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">{{item.post_title}}</h3>
                  <div>{{item.description}}</div>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn warning @click.native.stop="isEditClick(true, item)">Edit</v-btn>
                <v-btn error @click="deleteClick(item)">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-card-text v-if="postList.length==0">
            <p class="mt-2 text-xs-center">No data available</p>
          </v-card-text>
      </v-layout>
      <v-dialog v-model="state.openDialog" fullscreen transition="dialog-bottom-transition">
        <v-card class="m-container">
          <v-toolbar dark fixed class="primary" :style="{zIndex:1000}">
            <v-toolbar-title>{{state.isAdd ? 'Add':'Edit'}} Post</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="state.openDialog = state.isAdd = state.isEdit = false" dark>
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-container fluid grid-list-md :style="{paddingTop:'50px'}">
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
                </v-card>
              </v-flex>
              <v-flex xs12>
                <div class="mt-3">
                    <v-btn primary @click="submit()">Save</v-btn>
                    <v-btn error @click.native="state.openDialog = state.isAdd = state.isEdit = false">Cancel</v-btn>
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
var slugify = require("slugify");
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
        description: ""
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
    onCreated() {
      this.getData();
      this.getCategories();
      this.getTags();
    },
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
          description: ""
        };
        this.categories = [];
        this.tags = [];
      }
    },
    isEditClick(condition, row) {
      this.state.isEdit = condition;
      this.state.openDialog = condition;
      if (condition) {
        this.input = {
          id: row.id_post,
          title: row.post_title,
          content: row.post_content,
          description: row.description
        };

        this.$http
          .post("terms/getData", { id: row.post_categories.split(",") })
          .then(response => {
            if (!response.data.error_message) {
              this.categories = response.data.data;
            }
          });

        this.$http
          .post("terms/getData", { type: "tag", id: row.post_tags.split(",") })
          .then(response => {
            if (!response.data.error_message) {
              this.tags = response.data.data;
            }
          });
      }
    },
    featuredImageClick(item) {
      this.$modal
        .featuredImage()
        .then(thumbnail => {
          this.$http
            .post("posts/setFeaturedImage", {
              idPost: item.id_post,
              thumbnail: thumbnail
            })
            .then(response => {
              if (!response.data.error_message) {
                item.thumbnail = thumbnail;
              }
            });
        })
        .catch(rejected => {});
    },
    deleteClick(row) {
      this.$modal
        .confirm({
          message: "Are you sure you want to delete?"
        })
        .then(response => {
          this.$http
            .post("posts/submitDelete", {
              idPost: row.id_post
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
        let categoriesIdArray = [];
        this.categories.forEach(item => {
          categoriesIdArray.push(item.id);
        });
        let tagsIdArray = [];
        let tagsIdPromiseAll = [];
        this.tags.forEach(item => {
          if (item.id) {
            tagsIdArray.push(item.id);
          } else {
            tagsIdPromiseAll.push(
              this.$http.post("terms/submitAdd", {
                name: item,
                slug: slugify(item, {
                  remove: null,
                  lower: true
                }),
                description: "",
                type: "tag"
              })
            );
          }
        });
        Promise.all(tagsIdPromiseAll).then(response => {
          let categoriesId = categoriesIdArray.join(",");
          for (var i = 0; i < tagsIdPromiseAll.length; i++) {
            if (response[i].data.success_message) {
              tagsIdArray.push(response[i].data.id);
            }
          }
          let tagsId = tagsIdArray.join(",");

          if (this.state.isAdd) {
            this.$http
              .post("posts/submitAdd", {
                postTitle: this.input.title,
                postTitleSlug: slugify(this.input.title, {
                  remove: null,
                  lower: true
                }),
                postContent: this.input.content,
                description: this.input.description,
                postCategories: categoriesId,
                postTags: tagsId
              })
              .then(response => {
                if (response.data.success_message) {
                  this.isAddClick(false);
                  this.onCreated();
                }
              });
          }

          if (this.state.isEdit) {
            this.$http
              .post("posts/submitEdit", {
                idPost: this.input.id,
                postTitle: this.input.title,
                postTitleSlug: slugify(this.input.title, {
                  remove: null,
                  lower: true
                }),
                postContent: this.input.content,
                description: this.input.description,
                postCategories: categoriesId,
                postTags: tagsId
              })
              .then(response => {
                if (response.data.success_message) {
                  this.isEditClick(false);
                  this.onCreated();
                }
              });
          }
        });
      }
    }
  },
  created() {
    this.onCreated();
  }
};
</script>

<style lang="css">
  .m-container {
    height: inherit !important;
    overflow: auto;
  }
</style>
