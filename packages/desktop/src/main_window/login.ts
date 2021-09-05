import axios from 'axios';
import * as keytar from 'keytar';

async function fetchCurrentUser(url, access_token) {
  const response = await axios({
    url: url + "/api/graphql",
    method: 'post',
    data: {query: `query currentUser { user { id } }`},
    headers: {authorization: access_token}
  })
  return response
}

export async function renewSession(url, renewal_token) {
  //console.log("Renewing token")
  //console.log(url)
  //console.log(renewal_token)
  const response = await axios({
    url: url + "/api/session/renew",
    method: 'post',
    headers: {authorization: renewal_token}
  })
  return response
}

export async function validateTokens(url, tokens) {
  var response
  try {
    response = await fetchCurrentUser(url, tokens.access_token)
  } catch(e) {
    console.log("fetchcurrentuser failed")
    if(e.response) response = e.response
    else throw e
  }
  if (response.status === 200) return {status: "ok"}
  else if (response.status === 404) return {status: "error"} 
  else if (response.status === 401) {
    var response
    try {
      response = await renewSession(url, tokens.renewal_token)
      putTokens(response.data.data)
    } catch(e) {
      if(e.response) response = e.response
      else throw e
    }
    if (response.status === 200) return {status: "update", tokens: response.data.data}
    else if (response.status === 401) return {status: "error"}
  } 
  else {return {status: "error"}}
}

export async function loginUI(token, url) {
  let convertUrl = url + "/api/session/convert"
  const response = await axios.post(convertUrl, null, {headers: {'authorization': token}})
  return response
}

export async function putTokens(tokens) {
  console.log(`Putting tokens ${JSON.stringify(tokens)}`)
  await keytar.setPassword('UserDocs', 'accessToken', tokens.access_token)
  await keytar.setPassword('UserDocs', 'renewalToken', tokens.renewal_token)
}