import { observable, action } from 'mobx'
import { DATE_FORMAT, SchedulerData, ViewTypes } from 'react-big-scheduler'
import moment from 'moment'


class ScheduleStore {
  @observable schedulerData = new SchedulerData(new moment().format(DATE_FORMAT), ViewTypes.Month);
  @observable viewModel = this.schedulerData
  @observable events = []
  @observable resources = []

  @action setViewModel(schedulerData) {
    this.viewModel = schedulerData
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
    this.schedulerData.addEvent(event)
    this.viewModel = this.schedulerData
    this.events = this.schedulerData.events
  }

  @action addResource(resource) {
    this.schedulerData.addResource(resource)
    this.viewModel = this.schedulerData
    this.resources = this.schedulerData.resources
  }

}

export default new ScheduleStore()