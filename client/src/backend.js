import axios from 'axios'

const ERRORMSG = 'Something went wrong.'

export function authenticateUser(userInfo, callback) {
  axios.post('/auth/login', userInfo)
    .then(res => {
      if (res.status !== 200) {
        return callback(new Error('Unable to authenticate user'))
      }

      return callback(res.data)
    }).catch(err => {
      return callback(err)
  })
}

export function createNewUser(userInfo, callback) {
  axios.post('/auth/user', userInfo)
    .then(res => {
      if (res.status !== 201) {
        return callback(new Error('Unable to create new user'))
      }

      return callback(res.data)
    }).catch(err => {
      return callback(err)
  })
}

export function getUserInfo(callback) {
  axios.get('/auth/user')
    .then(res => {
      if (res.status !== 200) {
        console.log(res)
        return callback(new Error('Unable to get user info'))
      }

      return callback(res.data)
    }).catch(err => {
    return callback(err)
  })
}

export function authenticate(callback) {
  axios.get('/auth/authenticate')
    .then(res => {
      if (res.status !== 200) {
        return callback(new Error('Unable to authenticate user'))
      }

      return callback(res.status)
    }).catch(err => {
      return callback(new Error(err))
  })
}

export async function coolAuthenticate() {
  let res = await axios.get('/auth/authenticate')
  return res
}

export function getHouses(callback) {
  axios.get('/houses')
    .then(res => {
      if (res.status !== 200) {
        return callback(new Error('Something went wrong'))
      }

      return callback(res)
    }).catch(err => {
      return callback(err)
  })
}

export function getRooms(callback) {
  axios.get('/houses/rooms')
    .then(res => {
      if (res.status !== 200) {
        return callback(new Error(ERRORMSG))
      }

      return callback(res)
    }).catch(err => {
      return callback(err)
  })
}

export function getReservationsByRoom(roomId, callback) {
  axios.get(`/reservations/room/${roomId}`)
    .then(res => {
      if (res.status !== 200) {
        return callback(new Error(ERRORMSG))
      }

      return callback(res)
    }).catch(err => {
      return callback(err)
  })
}

export function getReservationsByHouse(houseId, callback) {
  axios.get(`/reservations/house/${houseId}`)
    .then(res => {
      if (res.status !== 200) {
        return callback(new Error(ERRORMSG))
      }

      return callback(res)
    }).catch(err => {
    return callback(err)
  })
}

export function getReservationsByLesseeId(lesseeId, callback) {
  axios.get(`/reservations/lessee/${lesseeId}`)
    .then(res => {
      if (res.status !== 200) {
        return callback(new Error(ERRORMSG))
      }

      return callback(res)
    }).catch(err => {
    return callback(err)
  })
}

export function logout(callback) {
  axios.post('/auth/logout')
    .then(res => {
      return callback(res.status)
    }).catch(err => {
      console.log(err)
  })
}











