<template>
  <nav class="navbar fixed-top navbar-dark bg-dark">
    <a class="navbar-brand">LITE-TEST</a>
    <span class="greet" v-if="this.account"> {{this.account.name}} </span>
    <button v-if="!this.account" type="button" class="btn btn-outline-light" @click="SignIn()">Log In</button>
    <button v-if="this.account" type="button" class="btn btn-outline-light" @click="SignOut()">Log Out</button>

  </nav>

  <div v-if="this.account">

    <div>
      <BusinessTable  :businessArray="this.businessArray"/>
    </div>

    <div v-if="isAdmin" class="input-group">
      <input type="text" class="form-control" v-model="businessDetails" placeholder="Enter business NIT"  aria-describedby="basic-addon2">
      <div class="input-group-append">
        <button class="btn btn-danger" type="button" @click="this.DeleteBusiness()">Delete</button>
      </div>
    </div>
    <br/>
    <div v-if="isAdmin">
      <h6>Create a new business:</h6>
        <br/>
        <div>
          <input type="text" class="form-control mx-auto" style="width: 400px;" v-model="NIT" placeholder="NIT" aria-describedby="basic-addon2">
        </div>
        <div>
          <input type="text" class="form-control mx-auto" style="width: 400px;" v-model="Name" placeholder="Name" aria-describedby="basic-addon2">
        </div>
        <div>
          <input type="text" class="form-control mx-auto" style="width: 400px;" v-model="Phone" placeholder="Phone" aria-describedby="basic-addon2">
        </div>
        <div>
          <input type="text" class="form-control mx-auto" style="width: 400px;" v-model="Address" placeholder="Address" aria-describedby="basic-addon2">
        </div>
        <br/>
        <div>
            <button class="btn btn-success" style="width: 400px;" type="button" @click="this.CreateBusiness()">Create</button>
        </div>
    </div>
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
      buisinessDetails: undefined,
      Name: undefined,
      NIT: undefined,
      Address: undefined,
      Phone: undefined,
      msalConfig: {
        auth: {
          clientId: process.env.VUE_APP_CLIENT_ID,
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
    async CreateBusiness() {

      let business = `{
      Name: "` + this.Name + `",` +
      `NIT: "` + this.NIT + `",` +
      `Address: "` + this.Address + `",` +
      `Phone: "` + this.Phone + `"` +
      "}";

      const response = await BusinessService.createBusiness(business);

      //console.log('response is ', response);

      if (!response) {
        return;
      }

      this.GetAllBusiness()
    },
    async DeleteBusiness() {
      const response = await BusinessService.deleteBusinessByNit(this.businessDetails);
      if (!response) {
        return;
      }

      this.GetAllBusiness()
      this.buisinessDetails = undefined
    },
    async GetAllBusiness() {
      const response = await BusinessService.getAllBusiness();
      if (!response) {
        return;
      }
      //console.log('response is ', response);
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
