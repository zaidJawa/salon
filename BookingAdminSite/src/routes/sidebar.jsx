/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'

const iconClasses = `h-6 w-6`
const routes = [
  {
    path: '/app/services',
    icon: <InboxArrowDownIcon className={iconClasses} />,
    name: 'services',
  },
  {
    path: '/app/BookedSessions',
    icon: <CurrencyDollarIcon className={iconClasses} />,
    name: 'Appointments',
  },


]

export default routes


