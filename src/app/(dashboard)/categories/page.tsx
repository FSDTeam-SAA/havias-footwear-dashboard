import React from 'react'
import Title from '../_components/Title'
import CategoryTableComponent from './_components/categoryComponents'

const Page = () => {
    return (
        <div>
            <Title title='Categories List' active='Dashboard > Categories > List' />
            <CategoryTableComponent/>
        </div>
    )
}

export default Page