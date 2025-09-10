import React from 'react'
import EditProduct from '../../_components/EditProduct'

function page({params}:{params:{id:string}}) {
  return (
    <div>
        <EditProduct id={params.id} />
    </div>
  )
}

export default page