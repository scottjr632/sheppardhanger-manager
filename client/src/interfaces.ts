export interface Document {
  id?: number,
  name: string,
  path: string,
  userid: number,
  lesseeid?: number,
  reservationid?: number
}

export interface EmailTemplate {
  name: string,
  template: string
}

export interface EmailData {
  from_email: string,
  email: string,
  subject: string,
  email_text: string,
  attachements?: Array<string>,
}