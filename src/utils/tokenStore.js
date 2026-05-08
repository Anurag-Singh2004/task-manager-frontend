let accessToken = null;

export const tokenStore = {
  setToken(token){
    accessToken = token
  },
  getToken() {
    return accessToken;
  },
  clearToken(){
    accessToken = null;
  }
}
//It is a bridge between AuthContext and api.js so that api.js can attach accesstoken for sending requests from the context to its interceptors