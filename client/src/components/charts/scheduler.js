import React from 'react'

import Scheduler, {SchedulerData, AddMorePopover, ViewTypes, DATE_FORMAT} from 'react-big-scheduler'
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
      viewModel: this.props.scheduleStore.viewModel,
      schedulerData: schedulerData,
      resources: [],
      events: [],
      headerItem: undefined,
      left: 0,
      top: 0,
      height: 0,
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
    const { viewModel } = this.props.scheduleStore
    let popover = <div />
    if (this.state.headerItem !== undefined) {
      popover =
          <AddMorePopover headerItem={this.state.headerItem} eventItemClick={this.eventClicked}
                          viewEventClick={this.ops1} viewEventText="Ops 1"
                          viewEvent2Click={this.ops2} viewEvent2Text="Ops 2"
                          schedulerData={viewModel}
                          closeAction={this.onSetAddMoreState} left={this.state.left} top={this.state.top}
                          height={this.state.height} moveEvent={this.moveEvent}/>;
  }
    return (
      <div>
        <div>
          <Scheduler schedulerData={viewModel}
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
                     onSetAddMoreState={this.onSetAddMoreState}
          />
          {popover}
        </div>
      </div>
    )
  }

  prevClick = (schedulerData)=> {
    schedulerData.prev()
    schedulerData.setEvents(this.props.scheduleStore.events)
    this.setState({
      viewModel: schedulerData
    })
  }

  nextClick = (schedulerData)=> {
    schedulerData.next()
    schedulerData.setEvents(this.props.scheduleStore.events)
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
    this.props.scheduleStore.setDate(schedulerData, date)
  }

  eventClicked = (schedulerData, event) => {
    this.props.history.push(`/reservation?id=${event.id}`)
  };

  ops1 = (schedulerData, event) => {
    this.props.history.push(`/reservation?id=${event.id}?edit=1`)
  };

  ops2 = (schedulerData, event) => {
    this.props.history.push(`/info?id=${event.lesseeId}`)
  };


  newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    this.props.setNewEventStartAndStop(start, end)
    this.props.showCreateEventModal()
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
    let newDate = new Date(newStart)
    newDate.setHours(0,0,0,0)
    newDate.setDate(newDate.getDate() + 1)
    let newEvent = { id: event.id, checkindate: newDate.toUTCString(), checkoutdate: event.end, roomid: event.resourceId}
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
    let newDate = new Date(newEnd)
    newDate.setHours(23,30,0,0)
    let newEvent = { id: event.id, checkindate: event.start, checkoutdate: newDate.toUTCString(), roomid: event.resourceId}
    schedulerData.updateEventEnd(event, newEnd);
    this.props.reservationStore.updateReservation(newDate.toUTCString())

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
    let newStart = new Date(start)
    let newEnd = new Date(end)
    newStart.setHours(0,0,0,0)
    newStart.setDate(newStart.getDate() + 1)
    newEnd.setHours(23, 30, 0, 0)
    let newEvent = { id: event.id, checkindate: newStart.toUTCString(), checkoutdate: newEnd.toUTCString(), roomid: slotId }
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

  onSetAddMoreState = (newState) => {
    if (newState === undefined) {
        this.setState({
            headerItem: undefined,
            left: 0,
            top: 0,
            height: 0
        });
    }
    else {
        this.setState({
            ...newState,
        });
    }
}
}


export default  withDragDropContext(Schedule)