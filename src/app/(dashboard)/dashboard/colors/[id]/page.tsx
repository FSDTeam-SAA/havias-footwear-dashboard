import React from 'react'
import ColorEdit from '../_components/colorEdit'

const Page = ({params}:{params:{id:string}}) => {
  return (
    <div>
        <ColorEdit id={params.id}/>
    </div>
  )
}

export default Page