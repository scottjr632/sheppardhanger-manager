import React, { Suspense, lazy } from 'react'

const Schedule = React.lazy(() => import('../components/charts/scheduler'))

const LoadableSchedule = props => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Schedule {...props} />
        </Suspense>
    )
}

export default LoadableSchedule