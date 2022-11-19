import { AxiosHandler } from './axios-handler';

const businessHandler = new AxiosHandler();

export default {
  async getBusinessByNit(nit) {
    const response = await businessHandler.getRequest("https://lite-test-api.azurewebsites.net/api/GetBusinessByNIT?code=" + process.env.VUE_APP_API_MASTER_KEY + "&&NIT=" + nit);
    return response
  },
  async getAllBusiness() {
    const response = await businessHandler.getRequest("https://lite-test-api.azurewebsites.net/api/GetAllBusiness?code=" + process.env.VUE_APP_API_MASTER_KEY);
    return response
  },
  async deleteBusinessByNit(nit) {
    const response = await businessHandler.deleteRequest("https://lite-test-api.azurewebsites.net/api/DeleteBusinessByNIT?code=" + process.env.VUE_APP_API_MASTER_KEY + "&&NIT=" + nit);
    return response
  }
};

