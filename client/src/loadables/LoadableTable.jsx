import React, { Suspense, lazy } from 'react'

const Table = React.lazy(() => import('../components/Tables/Table'))

const LoadableSchedule = props => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Table {...props} />
        </Suspense>
    )
}

export default LoadableSchedule