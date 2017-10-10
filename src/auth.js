export default {
  user: {
    authenticated: false
  },
  login(context, creds, redirect) {
    var self = this;
    context.$http.post('login', {
      username: creds.username,
      password: creds.password
    })
      .then(response => {
        if (response.data.success_message) {
          localStorage.setItem('token', response.data.jwt);
          self.user.authenticated = true;
          location.reload();
          context.$router.push('/');
        }
      })
      .catch(function (error) {
        console.log(error);
        context.error = error.body.error;
      });
  },
  logout(context) {
    localStorage.removeItem('token')
    this.user.authenticated = false;
    context.$router.push('/login');
  },
  checkAuth(context) {
    var jwt = localStorage.getItem('token');
    if (jwt) {
      this.user.authenticated = true;
    } else {
      this.user.authenticated = false;
    }
  }
}
