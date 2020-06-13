<template>
  <v-app>

    <v-content>
      <MainCal/>
    </v-content>
  </v-app>
</template>

<script>
import MainCal from './components/MainCal/MainCal';

export default {
  name: 'App',

  components: {
    MainCal
  },

  data: () => ({
  }),
};
</script>
