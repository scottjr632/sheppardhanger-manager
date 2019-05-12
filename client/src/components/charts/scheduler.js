import React from 'react'

import Scheduler, {SchedulerData, ViewTypes, DATE_FORMAT} from 'react-big-scheduler'
import withDragDropContext from './withDnDContext'
import moment from 'moment'
import { inject, observer } from 'mobx-react'
import { NotificationManager } from 'react-notifications'
import 'react-big-scheduler/lib/css/style.css'

import * as backend from '../../backend'

@inject ('roomStore')
@inject ('reservationStore')
@inject ('scheduleStore')
@observer
class Schedule extends React.Component{
  constructor(props){
    super(props);

    let schedulerData = new SchedulerData(new moment().format(DATE_FORMAT), ViewTypes.Month);
    schedulerData.localeMoment.locale('en');

    this.state = {
      forceRerender: false,
      viewModel: schedulerData,
      schedulerData: schedulerData,
      resources: [],
      events: []
    }
  }

  async componentDidMount() {0

    let { schedulerData } = this.state
    schedulerData.localeMoment.locale('en')

    await this.props.roomStore.populateRoomsAsync()
    let { rooms } = this.props.roomStore
    this.props.scheduleStore.setSchedulerResources(rooms)

    this.props.reservationStore.populateReservations(reservations => {
      this.props.scheduleStore.setEvents(reservations)
      this.setState({ resources: schedulerData.resources, events: schedulerData.events })
    })

  }

  forceRerender = () => {
    this.setState({forceRerender: !this.state.forceRerender})
  }

  handleChange = (e) => {
    let target = e.target
    this.setState({
      [target.name]: target.value
    })
  }

  render(){
    return (
      <div>
        <div>
          <Scheduler schedulerData={this.props.scheduleStore.viewModel}
                     prevClick={this.prevClick}
                     nextClick={this.nextClick}
                     onSelectDate={this.onSelectDate}
                     onViewChange={this.onViewChange}
                     eventItemClick={this.eventClicked}
                     viewEventClick={this.ops1}
                     viewEventText="Update reservation"
                     viewEvent2Text="View lessee"
                     viewEvent2Click={this.ops2}
                     updateEventStart={this.updateEventStart}
                     updateEventEnd={this.updateEventEnd}
                     moveEvent={this.moveEvent}
                     newEvent={this.newEvent}
                     onScrollLeft={this.onScrollLeft}
                     onScrollRight={this.onScrollRight}
                     onScrollTop={this.onScrollTop}
                     onScrollBottom={this.onScrollBottom}
          />
        </div>
      </div>
    )
  }

  prevClick = (schedulerData)=> {
    schedulerData.prev();
    schedulerData.setEvents(this.state.events);
    this.props.scheduleStore.setViewModel(schedulerData)
    // this.setState({
    //   viewModel: schedulerData
    // })
  }

  nextClick = (schedulerData)=> {
    schedulerData.next();
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData
    })
  }

  onViewChange = (schedulerData, view) => {
    this.props.scheduleStore.setViewType(view.viewType, view.showAgenda, view.isEventPerspective)
    this.setState({
      viewModel: schedulerData
    })
  }

  onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData
    })
  }

  eventClicked = (schedulerData, event) => {
    this.props.history.push(`/reservation?id=${event.id}`)
  };

  ops1 = (schedulerData, event) => {
    this.props.history.push(`/reservation?id=${event.id}`)
  };

  ops2 = (schedulerData, event) => {
    this.props.history.push(`/info?id=${event.lesseeId}`)
  };


  newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    if(confirm(`Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`)){

      let newFreshId = 0;
      schedulerData.events.forEach((item) => {
        if(item.id >= newFreshId)
          newFreshId = item.id + 1;
      });


      let newEvent = {
        id: newFreshId,
        title: this.state.name,
        start: start,
        end: this.state.date2,
        resourceId: slotId,
        ...this.createEventFromType(this.state.color)
      }
      schedulerData.addEvent(newEvent);
      this.setState({
        viewModel: schedulerData
      })
    }
  }

  createEventFromType = (type) => {
    switch (type) {
      case 'CLEANING':
        return {
          bgColor: '#75759e',
          title: 'CLEANING',
        }
      case 'BOOKING':
        return {
          bgColor: '#dc5c5c'
        }
      case 'TENTATIVE':
        return {
          bgColor: '#f3f37a',
          color: 'black'
        }
      default:
        return {
          bgColor: 'purple'
        }
    }
  }

  updateEventStart = (schedulerData, event, newStart) => {
    // if(confirm(`Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`)) {
    // }
    let newEvent = { id: event.id, checkindate: newStart, checkoutdate: event.end, roomid: event.resourceId}
    schedulerData.updateEventStart(event, newStart);
    this.props.reservationStore.updateReservation(newEvent)
    backend.updateReservation(newEvent, res=>{
      if (res.status !== 200) {
        NotificationManager.error('Unable to update event')
      }
    })
    this.setState({
      viewModel: schedulerData
    })
  }

  updateEventEnd = (schedulerData, event, newEnd) => {
    // if(confirm(`Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`)) {
    // }
    let newEvent = { id: event.id, checkindate: event.start, checkoutdate: newEnd, roomid: event.resourceId}
    schedulerData.updateEventEnd(event, newEnd);
    this.props.reservationStore.updateReservation(newEvent)

    backend.updateReservation(newEvent, res=>{
      if (res.status !== 200) {
        NotificationManager.error('Unable to update event')
      }
    })
    this.setState({
      viewModel: schedulerData
    })
  }

  moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    // if(confirm(`Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`)) {
    // }
    let newEvent = { id: event.id, checkindate: start, checkoutdate: end, roomid: slotId }
    schedulerData.moveEvent(event, slotId, slotName, start, end);
    this.props.reservationStore.updateReservation(newEvent)

    backend.updateReservation(newEvent, res=>{
      if (res.status !== 200) {
        NotificationManager.error('Unable to update event')
      }
    })
    this.setState({
      viewModel: schedulerData
    })
  }

  onScrollRight = (schedulerData, schedulerContent, maxScrollLeft) => {
    if(schedulerData.ViewTypes === ViewTypes.Day) {
      schedulerData.next();
      schedulerData.setEvents(this.state.events);
      this.setState({
        viewModel: schedulerData
      });

      schedulerContent.scrollLeft = maxScrollLeft - 10;
    }
  }

  onScrollLeft = (schedulerData, schedulerContent, maxScrollLeft) => {
    if(schedulerData.ViewTypes === ViewTypes.Day) {
      schedulerData.prev();
      schedulerData.setEvents(this.state.events);
      this.setState({
        viewModel: schedulerData
      });

      schedulerContent.scrollLeft = 10;
    }
  }

  onScrollTop = (schedulerData, schedulerContent, maxScrollTop) => {
    console.log('onScrollTop');
  }

  onScrollBottom = (schedulerData, schedulerContent, maxScrollTop) => {
    console.log('onScrollBottom');
  }
}


export default  withDragDropContext(Schedule)