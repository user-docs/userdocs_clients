import axios from 'axios';

async function fetchCurrentUser(url, access_token) {
  try {
    const response = await axios({
      url: url + "/api/graphql",
      method: 'post',
      data: {query: `query currentUser { user { id } }`},
      headers: {authorization: access_token}
    })
    return response
  } catch(e) {
    if(e.response) console.log("fetchCurrentUser failed, status:", e.response.status)
    else console.log("Renew Failed, error:", e)
    return e.response
  }
}

export async function renewSession(url, renewal_token) {
  //console.log("Renewing token")
  //console.log(url)
  //console.log(renewal_token)
  try {
    const response = await axios({
      url: url + "/api/session/renew",
      method: 'post',
      headers: {authorization: renewal_token}
    })
    return response
  } catch(e) {
    if(e.response) console.log("Renew failed, status:", e.response.status)
    else console.log("Renew Failed, error:", e)
    return e.response
  }
}

export async function validateTokens(url, tokens) {
  const response = await fetchCurrentUser(url, tokens.access_token)
  if (response.status === 200) return {status: "ok"}
  else if (response.status === 401) {
    const response = await renewSession(url, tokens.renewal_token)
    if (response.status === 200) return {status: "update", tokens: response.data.data}
    else if (response.status === 401) return {status: "error"}
  } 
}

export async function loginUI(token, url) {
  let convertUrl = url + "/api/session/convert"
  const response = await axios.post(convertUrl, null, {headers: {'authorization': token}})
  return response
}