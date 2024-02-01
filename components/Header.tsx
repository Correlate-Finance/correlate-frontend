import React from 'react'
import { Separator } from './ui/separator'

const Header = () => {
    return (
        <header className="flex-row justify-items-center" >
            <h1 className='text-5xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-center'>
                Correlate
            </h1>
            <Separator/>
        </header>
    )
}

export default Header