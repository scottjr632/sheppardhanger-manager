import { Document, EmailTemplate, EmailData } from './interfaces';
import axios from 'axios';
import { Server } from 'http';

interface ServerResponse {
  data: any,
  status: number,
  statusText: string
}

export namespace backend {

  export namespace document {
    const pathRegex: RegExp =  /^\/.*/
    const validatePath = (path: string): Boolean  => { return pathRegex.test(path) }

    export async function insertNewDocument(document: Document): Promise<Document> {
      if (!validatePath(document.path)) { throw new Error("Invalid path. Path must start with `/`") }

      const res = await axios.post('/documents/', document)
      return <Document><unknown>res.data
    }

    export async function getAllDocuments(): Promise<Array<Document>> { 
      const res = await axios.get<ServerResponse>('/documents'); 
      return <Array<Document>><unknown>res.data 
    }

    export async function getDocumentsForLessee(lesseeId: number): Promise<Array<Document>> {
      const res = await axios.get<ServerResponse>(`/documents/lessee/${lesseeId}`); 
      return <Array<Document>><unknown>res.data 
    }
  
    export async function getDocumentsForReservation(reservationId: number): Promise<Array<Document>> {
      const res = await axios.get<ServerResponse>(`/documents/reservations/${reservationId}`); 
      return <Array<Document>><unknown>res.data 
    }

    export async function updateDocument(document: Document): Promise<ServerResponse> {
      return await axios.put<ServerResponse>(`/documents`, JSON.stringify(document)); 
    }

    export async function deleteDocument(documentId: number): Promise<ServerResponse> {
      return await axios.delete<ServerResponse>(`/documents/${documentId}`)
    }
  }

  export namespace emails {
    export async function getAllEmailTemplate(): Promise<Array<EmailTemplate>> {
      const res = await axios.get<ServerResponse>('/email/templates')
      return <Array<EmailTemplate>><unknown>res.data
    }

    export async function createNewEmailTemplate(template: EmailTemplate): Promise<ServerResponse> {
      return await axios.post<ServerResponse>('/email/templates', template)
    }

    export async function deleteEmailTemplate(name: string): Promise<ServerResponse> {
      return await axios.delete<ServerResponse>(`/email/templates/${name}`)
    }

    export async function updateEmailTemplate(oldName: string, newName: string): Promise<ServerResponse> {
      return await axios.put<ServerResponse>(`/email/templates/${oldName}/${newName}`)
    }

    export async function resolveEmailTemplate(templateName: string, lesseeEmail: string): Promise<EmailTemplate> {
      const res =  await axios.get<ServerResponse>(`/email/templates/resolve/${templateName}/${lesseeEmail}`)
      return <EmailTemplate><unknown>res.data
    }

    export async function getAllLesseesEmails(): Promise<Array<string>> {
      const res = await axios.get<ServerResponse>('/lessee/emails')
      return  <Array<string>><unknown>res.data
    }

    export async function sendEmail(emailData: EmailData): Promise<ServerResponse> {
      return await axios.post<ServerResponse>('/email/', emailData)
    }

  }

}