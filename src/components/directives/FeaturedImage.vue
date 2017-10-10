<template>
  <v-layout transition="dialog-bottom-transition">
    <v-flex xs12 class="white">
      <v-toolbar>
        <v-toolbar-title>Set Featured Image</v-toolbar-title>
        <v-btn @click.native="chooseImage" dark>
          Add new image
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="cancelFn()" dark>
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm6 md4>
            <croppa v-model="croppa" disable-click-to-choose v-show="false"></croppa>
            <!-- <button @click="croppa.chooseFile()">CHOOSE FILE...</button> -->
          </v-flex>
          <v-flex xs12 sm6 md8>

          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      dialog: true,
      croppa: null
    }
  },
  methods: {
    chooseImage() {
      this.croppa.chooseFile()
    },
    okFn() {
      this.$emit('$ok', this.$el, null)
    },
    cancelFn() {
      this.$emit('$cancel', this.$el, null)
    }
  },
  // watch: {
  //   'croppa'(val) {
  //     console.log(val)
  //   }
  // }
}
</script>

<style>

</style>
