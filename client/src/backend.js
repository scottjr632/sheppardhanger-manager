import axios from 'axios'

const ERRORMSG = 'Something went wrong.'

const BuildApi = (url, data, errmsg) => {
  return {
    post: (callback) => {
      axios.post(url, data)
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            return callback(new Error(`${errmsg || ERRORMSG}`))
          }
    
          return callback(res)
        }).catch(err => {
          return callback(err)
      })
    },
    get: (callback) => {
      axios.get(url)
      .then(res => {
        if (res.status !== 200) {
          return callback(new Error(`${errmsg || ERRORMSG}`))
        }
  
        return callback(res)
      }).catch(err => {
        return callback(err)
      })
    },
    put: (callback) => {
      axios.put(url, data)
      .then(res => {
        return callback(res)
      }).catch(err => {
        return callback(err)
    })
    }
  }
}

export const authenticate = (callback) => BuildApi('/auth/authenticate').get(res => {
  return callback(res.status)
})
export const logout = (callback) => BuildApi('/auth/logout').post(res => {
  return callback(res.status)
})
export const authenticateUser = (data, callback) => BuildApi('/auth/login', data, 'Unable to authenticate user').post(res => { 
  if (res.data) {
    return callback(res.data)
  } 
  return callback
})
export const authenticateUserStay = (data, callback) => BuildApi('/auth/login?stayloggedin=1', data, 'Unable to authenticate user').post(res => { 
  if (res.data) {
    return callback(res.data)
  } 
  return callback
})

export const createNewUser = (data, callback) => BuildApi('/auth/user', data, 'Unable to create new user').post(callback)
export const getUserInfo = (callback) => BuildApi('/auth/user', '', 'Unable to get user info').get(callback)

export const getHouses = (callback) => BuildApi('/houses').get(callback)

export const getRooms = (callback) => BuildApi('/houses/rooms').get(callback)

export const getAllBookingTypes = (callback) => BuildApi('/reservations/bookingtypes').get(callback)
export const getReservationById = (reservationId, callback) => BuildApi(`/reservations/${reservationId}`).get(callback)
export const getReservationsByRoom = (roomId, callback) => BuildApi(`/reservations/room/${roomId}`).get(callback)
export const getReservationsByHouse = (houseId, callback) => BuildApi(`/reservations/house/${houseId}`).get(callback)
export const getReservationsByLesseeId = (lesseeId, callback) => BuildApi(`/reservations/lessee/${lesseeId}`).get(callback)
export const getAllReservations = (callback) => BuildApi('/reservations/').get(callback)
export const getAllReservationsUnfiltered = (callback) => BuildApi('/reservations?filter=0').get(callback)
export const updateReservation = (data, callback) => BuildApi('/reservations/', data).put(callback)
export const createNewReservation = (data, callback) => BuildApi('/reservations/', data).post(callback)
export const updateReservationStatus = (id, status, callback) => BuildApi(`/reservations/status/${id}/${status}`).get(callback)

export const createNewLessee = (data, callback) => BuildApi('/lessee/', data).post(callback)
export const getAllLessees = (callback) => BuildApi('/lessee/').get(callback)
export const getAllLesseesUnfiltered = (callback) => BuildApi('/lessee?filter=0').get(callback)
export const getLesseeById = (id, callback) => BuildApi(`/lessee/${id}`).get(callback)
export const updateLessee = (data, callback) => BuildApi(`/lessee/`, data).put(callback)
export const updateLesseeStatus = (id, status, callback) => BuildApi(`/lessee/status/${id}/${status}`).get(callback)

export const getAllRanks = (callback) => BuildApi('/lessee/ranks').get(callback)
export const addNewRank = (data, callback) => BuildApi('/lessee/ranks', data).post(callback)
export const getAllTDYTypes = (callback) => BuildApi('/lessee/tdys').get(callback)
export const addNewTDYType = (data, callback) => BuildApi('/lessee/tdys', data).post(callback)
export const getAllGuestTypes = (callback) => BuildApi('/lessee/guests').get(callback)
export const addNewGuestType = (data, callback) => BuildApi('/lessee/guests', data).post(callback)

export async function coolAuthenticate() {
  let res = await axios.get('/auth/authenticate')
  return res
}

export const getRoomsAsync = async () => {const data = await axios.get('/houses/rooms'); return data }
export const getAllReservationsAsync = async () => {const data = await axios.get('/reservations/'); return data}

export async function createNewLesseeAsync(data) {
  let res =  await axios.post('/lessee/', data)
  return res.data
}
