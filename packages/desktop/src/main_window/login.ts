import axios from 'axios';

export async function loginAPI(email, password, isDev) {
  console.log("loginAPI")
  let url
	const params = {
    'user[email]': email,
    'user[password]': password
	}

  if(isDev) url = "https://dev.user-docs.com:4002/api/session"
  else url = "https://app.user-docs.com/api/session"

	try {
		const response = await axios.post(url, null, { params: params })
		return response.data.data
	} catch (error) {
    throw error
	}
}

export async function loginUI(access_token, isDev) {
  console.log("loginUI")
  let url

  if(isDev) url = "https://dev.user-docs.com:4002/api/session/convert"
  else url = "https://app.user-docs.com/api/session/convert"

  const response = await axios.post(url, null, {headers: {'authorization': access_token}})
  return response
}