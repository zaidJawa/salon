import { useDispatch, useSelector } from 'react-redux';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import { closeRightDrawer } from '../features/common/rightDrawerSlice';

function RightSidebar({ bodyComponent, header, extraObject }) {
    const { isOpen } = useSelector((state) => state.rightDrawer);
    const dispatch = useDispatch();

    const close = () => {
        dispatch(closeRightDrawer());
    };

    return (
        <div
            className={`fixed inset-0 z-20 bg-gray-900 bg-opacity-25 transform ease-in-out ${isOpen ? 'transition-opacity opacity-100 duration-500 translate-x-0' : 'transition-all delay-500 opacity-0 translate-x-full'
                }`}
        >
            <section
                className={`absolute right-0 w-80 md:w-96 bg-base-100 h-full shadow-xl duration-500 ease-in-out transition-all transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="relative pb-5 flex flex-col h-full">
                    {/* Header */}
                    <div className="navbar flex pl-4 pr-4 shadow-md">
                        <button className="float-left btn btn-circle btn-outline btn-sm" onClick={close}>
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                        <span className="ml-2 font-bold text-xl">{header}</span>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-scroll pl-4 pr-4">
                        <div className="flex flex-col w-full">
                            {bodyComponent}
                        </div>
                    </div>
                </div>
            </section>

            {/* Background overlay to close the drawer */}
            <section className="w-screen h-full cursor-pointer" onClick={close}></section>
        </div>
    );
}

export default RightSidebar;
