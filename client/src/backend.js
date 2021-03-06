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
    },
    delete: (callback) => {
      axios.delete(url, data)
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
export const deleteReservation = (id, callback) => BuildApi(`/reservations/${id}`).delete(callback)
export const getMasterContract = (lesseeId, reservationId, callback) => BuildApi(`/lessee/master-contract/${lesseeId}/${reservationId}`).get(callback)

export const createNewLessee = (data, callback) => BuildApi('/lessee/', data).post(callback)
export const getAllLessees = (callback) => BuildApi('/lessee/').get(callback)
export const getAllLesseesUnfiltered = (callback) => BuildApi('/lessee?filter=0').get(callback)
export const getLesseeById = (id, callback) => BuildApi(`/lessee/${id}`).get(callback)
export const updateLessee = (data, callback) => BuildApi(`/lessee/`, data).put(callback)
export const updateLesseeStatus = (id, status, callback) => BuildApi(`/lessee/status/${id}/${status}`).get(callback)
export const deleteLessee = (lesseeId, callback) => BuildApi(`/lessee/${lesseeId}`).delete(callback)

export const getAllRanks = (callback) => BuildApi('/lessee/ranks').get(callback)
export const getAllTDYTypes = (callback) => BuildApi('/lessee/tdys').get(callback)
export const getAllGuestTypes = (callback) => BuildApi('/lessee/guests').get(callback)

export async function coolAuthenticate() {
  let res = await axios.get('/auth/authenticate')
  return res
}


export const createNewLesseeAsync = async (data) => {const res = await axios.post('/lessee/', data); return res.data}
export const getAllLesseeAsync = async () => {const data = await axios.get('/lessee/'); return data}

export const getAllRanksAsync = async () => {const data = await axios.get('/lessee/ranks'); return data}
export const addNewRank = async (name) => {const res = await axios.post('/lessee/ranks', { name }); return res}
export const updateRank = async (id, name) => {const res = await axios.put('/lessee/ranks', { id, name }); return res}
export const deleteRank = async (id) => {const res = await axios.delete(`/lessee/ranks/${id}`); return res}

export const getAllBookingTypesAsync = async () => {const data = await axios.get('reservations/bookingtypes'); return data}
export const addBookingType = async (name) => {const res = await axios.post('/reservations/bookingtypes', { name }); return res}
export const updateBookingType = async (id, name) => {const res = await axios.put('/reservations/bookingtypes', { id, name }); return res}
export const deleteBookingTypes = async (id) => {const res = await axios.delete(`/reservations/bookingtypes/${id}`); return res}

export const getTdyTypesAsync = async () => {const data = await axios.get('/lessee/tdys'); return data}
export const addTdyType = async (name) => {const res = await axios.post('/lessee/tdys', { name }); return res}
export const updateTdyType = async (id, name) => {const res = await axios.put('/lessee/tdys', { id, name }); return res}
export const deleteTdyType = async (id) => {const res = await axios.delete(`/lessee/tdys/${id}`); return res}

export const getGuestTypesAsync = async () => {const data = await axios.get('/lessee/guests'); return data}
export const addNewGuestType = async (name) => {const res = await axios.post('/lessee/guests', { name }); return res}
export const updateGuestType = async (id, name) => {const res = await axios.put('/lessee/guests', { id, name }); return res}
export const deleteGuestType = async (id) => {const res = await axios.delete(`/lessee/guests/${id}`); return res}

export const getHousesAsync = async () => {const data = await axios.get('/houses/'); return data}
export const getRoomsAsync = async () => {const data = await axios.get('/houses/rooms'); return data }
export const getRoomsByHouseId = async (houseId) => {const data = await axios.get(`/houses/${houseId}/rooms`); return data}

export const getAllReservationsAsync = async () => {const data = await axios.get('/reservations/'); return data}
export const newHouseReservationAsync = async (data) => {const res = await axios.post('/reservations/house-reservation', data); return res}

export const generateWelcomeEmail = async (lesseeName) => {const data = await axios.get(`/email/welcome/${lesseeName}`); return data}
export const generateNoRoomsEmail = async (lesseeName, month) => {const data = await axios.get(`/email/no-rooms/${lesseeName}/${month}`); return data}
export const generateContractEmail = async (lesseeName) => {const data = await axios.get(`/email/contract/${lesseeName}`); return data}
export const sendEmail = async (emailData) => {const data = await axios.post('/email/', emailData); return data}

export const getEmailTemplates = async () => {const data = await axios.get('/email/templates'); return data}
export const createNewEmailTemplate = async (data) => {const res = await axios.post('/email/templates', data); return res}
export const deleteEmailTemplate = async (name) => {const res = await axios.delete(`/email/templates/${name}`); return res}
export const updateEmailTemplateName = async (oldName, newName) => {const res = await axios.put(`/email/templates/${oldName}/${newName}`); return res}

export const getUserPreferences = async () => {const res = await axios.get('/auth/user/preferences'); return res}
export const updateUserPreferences = async (preferences) => {const res = await axios.post('/auth/user/preferences', {preferences}); return res}
export const updateUserPassword = async (password) => {const res = await axios.put('/auth/user/password', {password}); return res}

export const getAllEmailTemplates = async () => {const res = await axios.get('/email/templates'); return res}
