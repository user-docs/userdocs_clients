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
    console.log("Fetch failed, status:", e.response.status)
    return e.response
  }
}

	try {

export async function validateTokens(url, tokens) {
  console.log("validateTokens")
  const response = await fetchCurrentUser(url, tokens.access_token)
  if (response.status === 200) return {status: "ok"}
  else if (response.status === 401) {
    const response = await renewSession(url, tokens.renewal_token)
    if (response.status === 200) return {status: "update", tokens: response.data.data}
    else if (response.status === 401) return {status: "error"}
  } 
	}
  } 
}

export async function loginUI(token, url) {
  let convertUrl = url + "/api/session/convert"
  const response = await axios.post(convertUrl, null, {headers: {'authorization': token}})
  return response
}