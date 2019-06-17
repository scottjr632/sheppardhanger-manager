export const buildGmailLink = (targetEmail, subject, body) => {
  targetEmail = encodeURI(targetEmail)
  subject = encodeURI(subject)
  body = encodeURI(body)
  return `https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=${targetEmail}&su=${subject}&body=${body}`
}

export const buildMailToLink = (targetEmail, subject, body) => {
  return `mailto:${targetEmail}?subject=${subject}&body=${body}`
}


export const validateEmail = (email) => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const validatePassword1 = (password) => {
  let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
  return re.test(String(password))
}
