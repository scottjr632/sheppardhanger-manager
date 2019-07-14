import React from 'react'

import { Document } from '../../interfaces'
import { backend } from '../../backendts'

type MyFunc = (a: number) => number

interface UsersDocumentsProps {
  test?: MyFunc
}
interface UserDocumentsState {
  documents: Array<Document>
}

class UsersDocuments extends React.Component<UsersDocumentsProps, UserDocumentsState> {

  state = {
    documents: new Array<Document>()
  }

  componentDidMount(){
    backend.document.getAllDocuments().then(docs => {
      this.setState({
        documents: docs
      })
    }).catch(err => {
      console.log(err)
    })
  }

  deleteDoc = (id: number) => {
    let docIndex = this.state.documents.findIndex(doc => doc.id === id)
    backend.document.deleteDocument(id).then(() => {
      let documents = this.state.documents.slice()
      documents.splice(docIndex, 1)
      this.setState({ documents }) 
    }).catch(err => {
      console.log(err)
    })
  }

  insertDoc = () => {
    let doc: Document = {
      name: 'test',
      path: '/another/test',
      userid: 1
    }

    backend.document.insertNewDocument(doc).then(newDoc => {
      let documents = this.state.documents.slice()
      documents.push(newDoc)
      this.setState({ documents })
    })
  }

  render(){
    let { documents } = this.state
    return (
      <div>
        <button onClick={this.insertDoc}>Add new stuff</button>
        <table>
          <thead>
            <th>Name</th>
            <th>Path</th>
            <th>User id</th>
            <th>Lessee id</th>
            <th>Reservation id</th>
          </thead>
          <tbody>
            {documents.map(doc => {
              return (<tr>
                <td>{doc.name}</td>
                <td>{doc.path}</td>
                <td>{doc.userid}</td>
                <td>{doc.lesseeid}</td>
                <td>{doc.reservationid}</td>
                <td><button onClick={() => this.deleteDoc(doc.id)}>Delete</button></td>
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default UsersDocuments