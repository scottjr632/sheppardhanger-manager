import React, { Suspense, lazy } from 'react'

const NewCalendarEvent = React.lazy(() => import('../components/Modals/NewCalendarEvent'))

const LoadableSchedule = props => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewCalendarEvent {...props} />
        </Suspense>
    )
}

export default LoadableSchedule