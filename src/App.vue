<template>
  <nav class="navbar fixed-top navbar-dark bg-dark">
    <a class="navbar-brand">LITE-TEST</a>
    <span class="greet" v-if="this.account"> {{this.account.name}} </span>
    <button v-if="!this.account" type="button" class="btn btn-outline-light" @click="SignIn()">Log In</button>
    <button v-if="this.account" type="button" class="btn btn-outline-light" @click="SignOut()">Log Out</button>

  </nav>

  <div>
    <BusinessTable  v-if="this.account" :businessArray="this.businessArray"/>
  </div>
</template>

<script>
import { PublicClientApplication } from '@azure/msal-browser';
import BusinessService from '@/services/business-service.js';
import BusinessTable from '@/components/BusinessTable.vue';

export default {
  name: 'App',
  components: {
    BusinessTable
  },
  data() {
    return {
      account: undefined,
      businessArray: undefined,
      msalConfig: {
        auth: {
          clientId: 'd9f1b1ab-cedf-49c5-8e95-20114138b95f',
          authority:
            'https://login.microsoftonline.com/fd5ab338-f8b4-4de4-8ecd-2f46a044dad7',
        },
      },
      accessToken: undefined
    };
  },
  async created() {
    this.$msalInstance = new PublicClientApplication(
      this.msalConfig,
    );
  },
  mounted() {
    this.GetAllBusiness();
    const accounts = this.$msalInstance.getAllAccounts();
    if (accounts.length == 0) {
      return;
    }
    this.account = accounts[0];
    this.GetToken();
  },
  computed: {
    //Determine user access based on the user role state.
    isAdmin() {
      const admins = process.env.VUE_APP_ADMINS.split(',')
      if (this.account && admins.includes(this.account.username)) return true

      return false
    }
  },
  methods: {
    async GetAllBusiness() {
      const response = await BusinessService.getAllBusiness();
      if (!response) {
        return;
      }
      console.log('response is ', response);
      //this.$store.commit('SET_POLICIES', response.features);
      this.businessArray = response
    },
    async SignIn() {
      await this.$msalInstance
        .loginPopup({})
        .then(() => {
          const myAccounts = this.$msalInstance.getAllAccounts();
          this.account = myAccounts[0];
          this.GetToken();
          console.log("user isAdmin " + this.isAdmin)
        })
        .catch(error => {
          console.error(`error during authentication: ${error}`);
        });
    },
    async SignOut() {
      await this.$msalInstance
        .logoutPopup({})
        .then(() => {
          this.account = undefined
          this.accessToken = undefined
          console.log("user isAdmin " + this.isAdmin)
        })
        .catch(error => {
          console.error(error);
        });
    },
    async GetToken() {
      const silentRequest = {
            scopes: ['profile'],
            account: this.account
        };
      const silentResult = await this.$msalInstance.acquireTokenSilent(silentRequest);
      this.accessToken = silentResult;
      
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.greet{
  color: white
}

.navbar{
  padding: 10px
}
</style>
