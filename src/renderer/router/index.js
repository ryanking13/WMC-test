import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Intro-page',
      component: require('@/components/IntroPage').default,
    },
    {
      path: '/information-gathering',
      name: 'Information-gathering-page',
      component: require('@/components/InformationGatheringPage').default,
    },
    {
      path: '/test-selection',
      name: 'Test-selection-page',
      component: require('@/components/TestSelectionPage').default,
    },
    {
      path: '/wmc',
      name: 'WMC-test-page',
      component: require('@/components/WMCTestPage').default,
    },
    {
      path: '/end',
      name: 'Outro-page',
      component: require('@/components/OutroPage').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
