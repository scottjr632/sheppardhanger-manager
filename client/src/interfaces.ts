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