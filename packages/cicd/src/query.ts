interface AccessToken {
  access_token: string,
  renewal_token: string
}

export async function execute(client, query: string, variables: object = null) {
  try {
    const data = await client.request(query, variables)
    return data
  } catch (error) {
    //console.log("Query failed")
    throw Error(error)
  }
}