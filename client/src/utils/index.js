export const buildGmailLink = (targetEmail, subject, body) => {
  targetEmail = encodeURI(targetEmail)
  subject = encodeURI(subject)
  body = encodeURI(body)
  return `https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=${targetEmail}&su=${subject}&body=${body}`
}