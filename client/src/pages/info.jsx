import React from 'react'

import Navi from '../components/HeaderComponents/Navbar'
import Emails from '../components/Dashboard/Emails.jsx'
import UserInfo from '../components/Dashboard/UserInfo.jsx'
import ReservationTable from '../components/Tables/Reservations'
import Question from '../components/Dashboard/Question.jsx'
import NewEmailModal from '../components/Modals/NewEmailModal.jsx'
import { MONTHNAMES } from '../constants'
import * as backend from '../backend'

const testAttach = [
  {'name': 'Master Contract - Richardson.docx'}
]

const EMAILTYPES = {
  WELCOME: 'WELCOME',
  NOROOMS: 'NOROOMS',
  CONTRACT: 'CONTRACT'
}

const getTestFile = () => {
  backend.getMasterContract(16, 26, request => {
    console.log(request)

    var blob = new Blob([request.response], { type: 'application/pdf' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  })
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '[left] 50% [right] 50%',
  gridTemplateRows: 'auto'
}

class Info extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      userId: 0,
      userInfo: {},
      showModal: false,
      emailSubject: '',
      email_text: '',
    }
  }

  componentDidMount() {
    let { search } = this.props.location
    if (search && search.length > 1) {
      let id = search.match(/=(.*)/)
      if (id[1]) backend.getLesseeById(id[1], (res) => {
        let { data } = res
        if (data) this.setState({ userInfo: data, userId: id[1] })
      })
    }
  }

  emailStuff = {
    generic: {prettyName: 'Send Email', right: <i class="fas fa-envelope"></i>, btnText: 'Create Email', btnAction: () => { this.toggleEmailModal('') }},
  }

  emailInfo = {
    welcome: {prettyName: 'Welcome', right: <i class="fas fa-envelope"></i>, btnText: 'Welcome Email', btnAction: () => {this.toggleEmailModal('Welcome!'); this.generateEmail(EMAILTYPES.WELCOME) }},
    contract: {prettyName: 'Contract', right: <i class="fas fa-envelope"></i>, btnText: 'Contract', btnAction: () => {this.toggleEmailModal('Contract'); this.generateEmail(EMAILTYPES.CONTRACT) }},
    noRooms:  {prettyName: 'No Rooms', right: <i class="fas fa-envelope"></i>, btnText: 'No Rooms', btnAction: () => {this.toggleEmailModal('No Rooms Available'); this.generateEmail(EMAILTYPES.NOROOMS) }}
  }
  
  documentsInfo = {
    masterContract: {prettyName: 'Master Contract', right:<i class="fas fa-file-signature"></i>, btnText: 'Download master contract', btnAction: () => {this.toggleEmailModal('Master Contract') }},
    invoiceGenerator: {prettyName: 'Invoice', right: <i class="fas fa-receipt"></i>, btnText: 'Generate invoice', btnAction: () => { this.toggleEmailModal('Invoice'); }}
  }

  toggleEmailModal = (emailSubject) => {
    this.state.showModal ?
      this.setState({
        showModal: !this.state.showModal,
        email_text: '',
        emailSubject
      }) :
      this.setState({ 
        showModal: !this.state.showModal, 
        emailSubject 
      })
  }

  generateEmail = async (emailType) => {
    let response
    let { lname, fname } = this.state.userInfo

    switch (emailType) {
    case EMAILTYPES.WELCOME:
      response = await backend.generateWelcomeEmail(fname)
      break
    case EMAILTYPES.CONTRACT:
      response = await backend.generateContractEmail(fname)
      break
    case EMAILTYPES.NOROOMS:
      let month
      let { reservations } = this.state.userInfo
      if (reservations.length > 0) {
        let firstRes = reservations[0]
        month = new Date(firstRes.checkindate).getMonth()
      } else {
        month = prompt('Enter month')
      }

      response = await backend.generateNoRoomsEmail(fname, MONTHNAMES[month] || month)
      break
    }
    
    if (response.status === 200) {
      let { data } = response
      this.setState({ email_text: data.message })
    }
  }

  render() {
    return (
      <div>
      <Navi />
        <div className={'container'} style={{...gridStyle}}>
          <div style={{gridArea: 'left', gridRow: 1}}>
            <section style={{marginBottom: '25px'}}>
              <Emails data={this.emailStuff} title={'EMAIL'}/>
            </section>
            <section style={{marginBottom: '25px'}}>
              <Emails data={this.emailInfo} title={'EMAIL TEMPLATES'}/>
            </section>
            <section>
              <Emails data={this.documentsInfo} title={'DOWNLOAD DOCUMENTS'}/>
            </section>
          </div>
          <section style={{gridArea: 'right', gridRow: 1}}>
            <UserInfo data={this.state.userInfo} history={this.props.history} />
          </section>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}} className={'container'}>
          <div className='table large-screen' style={{gridArea: 'tbl'}}>
            <div>
              <Question helpText={`List of all the user's reservations. Search and filter to find a specific reservation.`} />
              <label>Locate a reservation</label>
              <ReservationTable lesseeId={this.state.userId} history={this.props.history}/>
            </div>
          </div>
        </div>
        <NewEmailModal 
          showModal={this.state.showModal} 
          toggleModal={this.toggleEmailModal} 
          email={this.state.userInfo.email || ''} 
          subject={this.state.emailSubject} 
          attachements={[]}
          email_text={this.state.email_text}
        />
      </div>
    )
  }

}

export default Info