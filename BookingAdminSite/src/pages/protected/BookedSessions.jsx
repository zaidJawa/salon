import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Bookings from '../../features/bookings'

function InternalPage() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title: "Bookings" }))
    }, [])


    return (
        <Bookings />
    )
}

export default InternalPage