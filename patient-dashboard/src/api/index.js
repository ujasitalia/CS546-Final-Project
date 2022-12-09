import * as login from "./login"
import * as doctor from "./doctor"
import * as appointment from './appointment'
import * as patient from "./patient"
import * as signup from "./signup"

const api = {
    login,
    search, 
    filter,
    doctor,
    appointment,
    patient,
    signup
  }
export { api }