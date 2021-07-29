interface Window { userdocs: any }

const login = document.getElementById('login')
login.addEventListener("submit", async (event) => {
  event.preventDefault()

  const emailElement: any = document.getElementById('email')
  const passwordElement: any  = document.getElementById('password')
  const credentials = { email: emailElement.value, password: passwordElement.value }
  const result = window.userdocs.login(credentials)
})