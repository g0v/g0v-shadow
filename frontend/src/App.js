import React, { Component } from 'react'
import loading from './loading.svg'
import Resources from './resources'
import './App.css'

class App extends Component {
  async componentDidMount () {
    let shadowURL = getShadowURL()
    let resp = await fetch(`http://shadow.devpoga.org/topics?url=${shadowURL}`)
    let json = await resp.json()
    console.log(json)
    this.setState({ scores: json.scores, title: json.title })
  }

  render () {
    if (!this.state || !this.state.scores) {
      return (
        <div className='App'>
          <header className='App-header'>
            <img src={loading} className='App-logo' alt='logo' />
            <h1 className='App-title'>分析中...</h1>
          </header>
        </div>
      )
    }

    return (
      <div className='App'>
        <header className='App-header'>
          <img src={loading} className='App-logo' alt='logo' />
          <h1 className='App-title'>{this.state.title}</h1>
        </header>

        <Resources scores={this.state.scores} />
      </div>
    )
  }
}

export default App

function getShadowURL () {
  // for dev
  // return 'http://www.ey.gov.tw'

  // for production
  return window.location.href.replace('devpoga.org', 'gov.tw')
}
