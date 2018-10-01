import React, { Component } from 'react'

class Progress extends Component {
  render () {
    let color = this.props.color || 'blue'
    let percent = this.props.percent || 0
    return (
      <div className='shadow w-full bg-grey-light'>
        <div className={`bg-${color} text-xs leading-none py-1 text-center text-white`} style={{ width: `${percent}%` }}>Loading...</div>
      </div>
    )
  }
}

export default Progress
