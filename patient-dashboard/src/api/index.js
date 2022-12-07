import * as login from "./login"
import * as doctor from "./doctor"
import * as appointment from './appointment'
import * as patient from "./patient"

const api = {
    login,
    search, 
    filter,
    doctor,
    appointment,
    patient,
  }
export { api }