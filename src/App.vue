<template>
  <v-app toolbar>
    <v-navigation-drawer v-if="user.authenticated" class="pb-0" persistent clipped enable-resize-watcher v-model="drawer">
      <v-list dense>
        <v-list-group v-for="item in items" :value="item.active" v-bind:key="item.title">
          <v-list-tile v-if="item.items" slot="item">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="item.items">
              <v-icon>keyboard_arrow_down</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile v-else slot="item" :to="'/'+item.path" exact>
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="item.items">
              <v-icon>keyboard_arrow_down</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile v-for="subItem in item.items" v-bind:key="subItem.title" :to="'/'+subItem.path" exact>
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>{{ subItem.action }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar v-if="user.authenticated" class="indigo" dark fixed>
      <v-toolbar-title>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-toolbar-title>
      <v-toolbar-title>AAR Framework</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <v-btn icon dark slot="activator" class="cyan">
          <v-icon>person</v-icon>
        </v-btn>
        <v-card>
          <v-list>
            <v-list-tile @click="goToProfile()">
              <v-list-tile-content>
                <v-list-tile-title>My Profile</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="logout()">
              <v-list-tile-content>
                <v-list-tile-title>Logout</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>
    </v-toolbar>
    <main>
      <v-container>
        <v-layout>
          <v-flex xs12>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import auth from './auth'
export default {
  data: () => ({
    user: auth.user,
    drawer: true,
    items: [
      {
        icon: 'view_module',
        title: 'Modules',
        path: ''
      },
      {
        icon: 'assignment_ind',
        title: 'Roles',
        path: 'roles'
      },
      {
        icon: 'group',
        title: 'Users',
        path: 'users'
      },
      {
        icon: 'assignment_turned_in',
        title: 'Permissions',
        path: 'permissions'
      },
      {
        icon: 'library_books',
        title: 'Posts',
        items: [
          { title: 'All Posts', path: 'posts' },
          { title: 'Categories', path: 'posts/categories' },
          { title: 'Tags', path: 'posts/tags' }
        ],
        path: 'posts'
      }
    ]
  }),
  methods: {
    goToProfile() {
      this.$router.push('/profile')
    },
    logout() {
      auth.logout(this)
    },
    getActiveLink() {
      this.items.forEach((item) => {
        if (item.path === '') {
          item.active = false
          if (this.$route.name === 'modules') item.active = true
        } else if (item.path === 'roles') {
          item.active = false
          if (this.$route.name === 'roles') item.active = true
        } else if (item.path === 'users') {
          item.active = false
          if (this.$route.name === 'users') item.active = true
        } else if (item.path === 'permissions') {
          item.active = false
          if (this.$route.name === 'permissions') item.active = true
        } else if (item.path === 'posts') {
          item.active = false
          if (this.$route.name === 'posts' || this.$route.name === 'addPosts' || this.$route.name === 'categories' || this.$route.name === 'tags') item.active = true
        }
      })
    }
  },
  created() {
    this.getActiveLink()
  },
  watch: {
    '$route'() {
      this.getActiveLink()
    }
  }
}
</script>


<style>
html {
  overflow: auto !important;
}
a:hover {
  text-decoration: none
}

.navigation-drawer>.list .list--group__container .list__tile--active .list__tile__title {
  color: black !important;
}

.list__tile--active {
  border-right: 3px solid #1976D2;
  background-color: #E0E0E0;
}

.list__tile:after {
  height: 0px !important;
}

.btn--small {
  font-size: 10px !important
}
</style>
