import axios from 'axios'

const require = axios.create({
  baseURL: 'http://localhost/Virgo_Tyh_PHP/public/index.php/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default require
