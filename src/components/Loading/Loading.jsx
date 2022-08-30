import React from 'react'
import './Loading.css'
import { useSelector } from 'react-redux'
export default function Loading() {
  const {visible} = useSelector(state => state.LoadingReducer);
  if (visible) {
    return (
      <div>
        <img className='loading' src={require('../../assets/images/loading.gif')} alt='' />
      </div>
    )
  } else {
    return "";
  }

}
