import React, { Component } from 'react'
import loading from './loading.svg'
import Resources from './resources'

class App extends Component {
  constructor () {
    super()
    this.state = { queryURL: '' }
  }

  async onSubmit (e) {
    e.preventDefault()

    let shadowURL = this.state.queryURL
    console.log('shadowing', shadowURL)
    let resp = await window.fetch(`http://35.221.159.176:8080/topics?url=${shadowURL}`)
    let json = await resp.json()
    console.log(json)
    this.setState({ scores: json.scores, title: json.title })
  }

  handleChange (e) {
    this.setState({ queryURL: e.target.value })
  }

  render () {
    const queryURL = this.state.queryURL

    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <img src='logo.jpg' />
        <form className='min-w-full flex flex-col items-center' onSubmit={this.onSubmit.bind(this)}>
          <input
            className='mt-4 mx-4 shadow appearance-none border rounded w-3/5 xl:w-2/5 py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            placeholder='gov. website URL'
            value={queryURL}
            onChange={this.handleChange.bind(this)} />
          <input
            className='mt-4 bg-grey-light hover:bg-grey text-grey-darker hover:text-black font-bold py-2 px-4 rounded'
            type='submit'
            value='Search!'
          />
        </form>
        <img src={loading} className='App-logo' alt='logo' />
        <h1 className='App-title'>{this.state.title}</h1>

        {/* <Resources scores={this.state.scores} /> */}
      </div>
    )
  }
}

export default App

function getShadowURL () {
  // for dev
  return 'http://www.ey.gov.tw'

  // for production
  // return window.location.href.replace('devpoga.org', 'gov.tw')
}
