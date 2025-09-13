import React from 'react'

interface type {
    title: string
    active: string
}

const Title = ({ title, active }: type) => {
    return (
        <div>
            <h1 className='text-[#1C2228] font-semibold text-3xl mb-[8px]'>{title}</h1>
            <p className='text-[#929292] text-[16px] font-medium'>{active}</p>
        </div>
    )
}

export default Title