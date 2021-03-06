import { observable, action } from 'mobx'
import { DATE_FORMAT, SchedulerData, ViewTypes } from 'react-big-scheduler'
import moment from 'moment'


class ScheduleStore {
  @observable hasInit = false
  @observable schedulerData = new SchedulerData(new moment().format(DATE_FORMAT), ViewTypes.Month, false, false, {
    eventItemPopoverEnabled: true,
    dayMaxEvents: 3,
    weekMaxEvents: 99999,
    monthMaxEvents: 99999,
    quarterMaxEvents: 99999,
    yearMaxEvents: 99999,
    dayCellWidth: 30,
    weekCellWidth: '12%',
    monthCellWidth: '3%',
    quarterCellWidth: 40,
    yearCellWidth: 80,
    customCellWidth: 80,
    views: [
        {viewName: 'Agenda View', viewType: ViewTypes.Month, showAgenda: true, isEventPerspective: false},
        {viewName: 'Week', viewType: ViewTypes.Week, showAgenda: true, isEventPerspective: false},
        {viewName: 'Month', viewType: ViewTypes.Month, showAgenda: false, isEventPerspective: false},
        {viewName: 'Quarter', viewType: ViewTypes.Quarter, showAgenda: false, isEventPerspective: false},
        {viewName: 'Task View', viewType: ViewTypes.Month, showAgenda: false, isEventPerspective: true},
    ]
  });
  @observable viewModel = this.schedulerData
  @observable events = []
  @observable resources = []

  @action setNewSchedulerWithCustumConfig(config) {
    if (config) { 
      try { config = JSON.parse(config)} catch (e) {}
    }

    this.schedulerData = new SchedulerData(new moment().format(DATE_FORMAT), ViewTypes.Month, false, false, {
      eventItemPopoverEnabled: true,
      dayMaxEvents: 3,
      weekMaxEvents: 99999,
      monthMaxEvents: 99999,
      quarterMaxEvents: 99999,
      yearMaxEvents: 99999,
      dayCellWidth: 30,
      weekCellWidth: '12%',
      monthCellWidth: '3%',
      quarterCellWidth: 40,
      yearCellWidth: 80,
      customCellWidth: 80,
      views: [
        {viewName: 'Month', viewType: ViewTypes.Month, showAgenda: false, isEventPerspective: false},
      ],
      ...config
    });
    
    this.viewModel = this.schedulerData
  }

  @action setHasInit(hasInit) {
    this.hasInit = hasInit
  }

  @action setViewModel(schedulerData) {
    this.viewModel = schedulerData
  }

  @action setResourcesAndEvents() {
    this.schedulerData.setResources(this.resources)
    this.schedulerData.setEvents(this.events)
    this.viewModel = this.schedulerData    
  }

  @action setViewType(type, agenda, isEventPerspective) {
    this.schedulerData.setViewType(type, agenda, isEventPerspective)
    this.schedulerData.setEvents(this.events)
    this.viewModel = this.schedulerData
  }

  @action setSchedulerResources(resources) {
    this.schedulerData.setResources(resources)
    this.viewModel = this.schedulerData
    this.resources = resources
  }

  @action setEvents(events) {
    this.schedulerData.setEvents(events)
    this.viewModel = this.schedulerData
    this.events = events
  }

  @action addEvent(event) {
    let index = this.schedulerData.events.findIndex(e => e.id === event.id)
    if (index === -1) {
      this.schedulerData.addEvent(event)
      this.viewModel = this.schedulerData
      this.events = this.schedulerData.events
    }
  }

  @action addResource(resource) {
    this.schedulerData.addResource(resource)
    this.viewModel = this.schedulerData
    this.resources = this.schedulerData.resources
  }

  @action setDate(schedulerData, date) {
    schedulerData.setDate(date);
    this.schedulerData = schedulerData
    this.setEvents(this.events)
    this.viewModel = schedulerData
  }

  @action prev(schedulerData){
    this.schedulerData.prev()
    this.schedulerData = schedulerData
    this.setEvents(this.events)
    this.viewModel = schedulerData
  }

  @action next(schedulerData){
    schedulerData.next()
    this.schedulerData = schedulerData
    this.setEvents(this.events)
    this.viewModel = schedulerData
  }

}

export default new ScheduleStore()