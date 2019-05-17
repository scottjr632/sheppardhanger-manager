import React, { Suspense, lazy } from 'react'

const NewLesseeModal = React.lazy(() => import('../components/Modals/NewLesseeModal'))

const LoadableSchedule = props => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewLesseeModal {...props} />
        </Suspense>
    )
}

export default LoadableSchedule