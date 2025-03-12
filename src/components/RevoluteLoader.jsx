import { useState, useEffect } from 'react'

export default function RevoluteLoader({ displayLoader, setDisplayLoader }) {

    // Handle the state of the overlay and loader box
    const [overlay, setOverlay] = useState(false)
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (displayLoader) {
            // display the overlay first 
            setOverlay(true)

            // use a timer for the loader box
            setTimeout(() => {
                setLoader(true)

                // onmount the loader
                setTimeout(() => {
                    onMountEffect()

                    // set the displayLoader back to false
                    setTimeout(() => {
                        setDisplayLoader(false)
                    }, 100)
                }, 3000)
            }, 100)
        }
    }, [displayLoader])

    // this function onmount the whole loader with transition still intact
    const onMountEffect = () => {
        setLoader(false)

        // remove the overlay after timeout
        setTimeout(() => {
            setOverlay(false)
        }, 2000)
    }

    return (
        <div className={`fixed w-full h-screen z-[100] inset-0 bg-[#f7f7f7] justify-center items-center ${overlay ? 'flex' : 'hidden'}`}>

            {/* Loader container  */}
            <div className={`rounded-xl z-[200] transition-all duration-500  w-12 h-12 ${loader ? 'opacity-100 -translate-y-5' : 'opacity-0 translate-y-0'} bg-white p-2 flex justify-center items-center`}>
                <img src="https://assets.revolut.com/assets/brand/Revolut-Symbol-Black.svg" className="pulse" alt="Revolut logo" />
            </div>
        </div>
    )
}
