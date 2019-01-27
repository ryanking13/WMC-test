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
      path: '/test-explanation/:id',
      name: 'Test-explanation-page',
      component: require('@/components/TestExplanationPage').default,
      props: true,
    },
    {
      path: '/test-end-practice/:id',
      name: 'Test-practice-ended-page',
      component: require('@/components/TestEndPracticePage').default,
      props: true,
    },
    {
      path: '/test/:id/:type',
      name: 'Test-page',
      component: require('@/components/TestPage').default,
      props: true,
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
