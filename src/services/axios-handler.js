  import axios from 'axios'

export class AxiosHandler {
  async getRequest (url) {
    try {
      //this._cancelPreviousRequest(url)
      //this._trackCurrentRequest(url)

      const response = await axios.get(url)
      return (response.data && response.data.items) ? response.data.items : response.data
    } catch (error) {
      if (axios.isCancel(error)) {
        // Request was cancelled. No further action required
      } else
        throw error
    }
  }

  async postRequest (url, payload, params = {}) {
    try {

      const response = await axios.post(url, payload, Object.assign({}, params))

      return (response.data && response.data.items) ? response.data.items : response.data
      
    } catch (error) {
        console.log('ERROR ' + error)
    }
  }
}
