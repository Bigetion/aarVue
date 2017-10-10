<template>
  <v-layout justify-center class="modal-content">
    <v-card class="white">
      <v-card-title>
        <div class="headline">Confirmation</div>
      </v-card-title>
      <v-card-text>{{message}}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="green--text darken-1" flat="flat" @click="okFn">OK</v-btn>
        <v-btn class="red--text darken-1" flat="flat" @click="cancelFn">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  props: ['message'],
  data() {
    return {
      dialog: true
    }
  },
  methods: {
    okFn: function() {
      this.$emit('$ok', this.$el, null)
    },
    cancelFn: function() {
      this.$emit('$cancel', this.$el, null)
    }
  }
}
</script>

<style>
.modal-content {
  align-items: center;
  height: 100%;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  transition: 0.3s ease-in-out;
  width: 100%;
  z-index: 100;
}
</style>
