import { GraphQLClient } from 'graphql-request'
import axios from 'axios';

interface Credentials {
  authUrl: string;
  email: string;
  password: string;
}

export async function authenticate(url, credentials : Credentials) {
	const params = {
    'user[email]': credentials.email,
    'user[password]': credentials.password
	}
	try {
		const response = await axios.post(url, null, { params: params })
		return response.data.data
	} catch (error) {
		throw Error(error)
	}
}

export async function create(url, tokens) {
  const headers = {
    authorization: tokens.access_token
  }
  return new GraphQLClient(url, { headers: headers })
}