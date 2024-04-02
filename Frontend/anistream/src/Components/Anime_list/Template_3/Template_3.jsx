import React from 'react'
// import './template.css'
const Template_3 = (props) => {
    let name=props.series.name;
  return (
    <div className='cursor-default m-1 flex flex-col rounded-xl shadow-[8px_8px_10px_rgba(0,0,0,0.5)] lg:w-80 w-[calc(100vw*0.38)] hover:scale-110 transition ease-in-out duration-500'>
        <img src={props.series.cover_image} className=' lg:w-80 w-[calc(100vw*0.38)] rounded-t-xl' alt="image" />
        <p className='bg-purple-800 lg:text-lg text-md justify-center rounded-b-xl p-1 whitespace-nowrap text-ellipsis overflow-hidden items-center text-center'> {name}</p>
    </div>
  )
}

export default Template_3