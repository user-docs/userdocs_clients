import axios from 'axios';

export async function loginAPI(email, password, url) {
  const sessionUrl = url + "/api/session"
	const params = {
    'user[email]': email,
    'user[password]': password
	}

	try {
		const response = await axios.post(sessionUrl, null, { params: params })
		return response.data.data
	} catch (error) {
    throw error
	}
}

export async function loginUI(token, url) {
  let convertUrl = url + "/api/session/convert"
  const response = await axios.post(convertUrl, null, {headers: {'authorization': token}})
  return response
}