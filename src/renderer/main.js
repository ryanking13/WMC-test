import 'semantic-ui-css/semantic.min.css';
import Vue from 'vue';
import axios from 'axios';
import SuiVue from 'semantic-ui-vue';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';
import VueCookies from 'vue-cookies';

import App from './App';
import router from './router';
import store from './store';


if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.use(SuiVue);

/* cookie setting */
Vue.use(VueCookies);
VueCookies.set('user', '{}');
VueCookies.set('test-result', '{}');

/* icons */
Vue.component('v-icon', Icon);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
