import { ViewTypes } from 'react-big-scheduler'

const OTHER_COLORS = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6',
    '#34495e', '#16a085', '#27ae60', '#2980b9', 
    '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22',
    '#e74c3c', '#ecf0f1', '#95a5a6', '#f39c12',
    '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'
]

export const BOOKINGTYPECOLORS = {
    'TENTATIVE': '#e9c912',
    'CONFIRMED': '#e95d12',
    'CLEANING': '#ac12e9',
    'HOTEL': OTHER_COLORS[0],
  }

export const EMAILPREFS = {
    APPLICATION: 'APPLICATION',
    BROWSER: 'BROWSER',
    MODAL: 'MODAL',
    DEFAULT: 'DEFAULT'
  }

export const STATUS_ARCHIVED = 'archived'
export const STATUS_ACTIVE = 'active'

export const CALENDAR_CLEANING = 'CLEANING'
export const CALENDAR_CONFIRMED = 'CONFIRMED'
export const CALENDAR_TENTATVE = 'TENTATIVE'

export const MONTHNAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export const SCHEDULER_VIEWS = [
  {viewName: 'Agenda View', viewType: ViewTypes.Month, showAgenda: true, isEventPerspective: false},
  {viewName: 'Week', viewType: ViewTypes.Week, showAgenda: true, isEventPerspective: false},
  {viewName: 'Month', viewType: ViewTypes.Month, showAgenda: false, isEventPerspective: false},
  {viewName: 'Quarter', viewType: ViewTypes.Quarter, showAgenda: false, isEventPerspective: false},
  {viewName: 'Year', viewType: ViewTypes.Year, showAgenda: false, isEventPerspective: false},
  {viewName: 'Task View', viewType: ViewTypes.Month, showAgenda: false, isEventPerspective: true},
]