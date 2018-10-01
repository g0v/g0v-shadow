import React, { Component } from 'react'

class Resources extends Component {
  render () {
    return (
      <div className='border p-8'>
        <div className='my-4'>
          <h4 className='text-grey-darker'>Related Projects</h4>
        </div>
        {this.props.resourceList.map(r => {
          return (
            <div className='flex flex-row justify-between py-2' key={r.id}>
              <div>
                <a href={r.fields.URL} className='link blue lh-title'>
                  <span className='fw7 underline-hover'>{r.fields.Name}</span>
                </a>
              </div>
              <div>
                {r.fields.SDG.map(s => {
                  return <span key={s} className='inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2' >{s}</span>
                })}
              </div>
            </div>
          )
        })
        }
      </div>
    )
  }
}

export default Resources
