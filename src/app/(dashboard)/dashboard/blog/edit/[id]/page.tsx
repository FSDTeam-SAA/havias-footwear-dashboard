import React from 'react'
import EditBlog from '../../_components/EditBlog'

function page({params}:{params:{id:string}}) {
  return (
    <div>
        <EditBlog id={params.id} />
    </div>
  )
}

export default page