import React, { Component } from 'react'
import Resources from './resources'

class App extends Component {
  constructor () {
    super()
    let path = window.location.pathname
    let route = { p: '/', d: '' }

    if (path.startsWith('/s/')) {
      let d = path.replace(/^\/s\//, '')
      route = { p: '/s/', d }
    }

    this.state = { queryURL: '', route }
  }

  componentDidMount () {
    if (this.state.route.p === '/s/') this.loadShadow(this.state.route.d)
  }

  async onSubmit (e) {
    e.preventDefault()

    await this.loadShadow(this.state.queryURL)
  }

  renderChart () {
    var w = 300
    var h = 300

    var dd = [this.state.scores.sort((x, y) => {
      if (x.name < y.name) return -1
      if (x.name > y.name) return 1
      return 0
    }).map(s => {
      return { axis: s.name, value: s.score }
    })]
    // Data
    var d = [
		  [
        { axis: 'Email', value: 0.59 },
        { axis: 'Social Networks', value: 0.56 },
        { axis: 'Internet Banking', value: 0.42 },
        { axis: 'News Sportsites', value: 0.34 },
        { axis: 'Search Engine', value: 0.48 },
        { axis: 'View Shopping sites', value: 0.14 },
        { axis: 'Paying Online', value: 0.11 },
        { axis: 'Buy Online', value: 0.05 },
        { axis: 'Stream Music', value: 0.07 },
        { axis: 'Online Gaming', value: 0.12 },
        { axis: 'Navigation', value: 0.27 },
        { axis: 'App connected to TV program', value: 0.03 },
        { axis: 'Offline Gaming', value: 0.12 },
        { axis: 'Photo Video', value: 0.4 },
        { axis: 'Reading', value: 0.03 },
        { axis: 'Listen Music', value: 0.22 },
        { axis: 'Watch TV', value: 0.03 },
        { axis: 'TV Movies Streaming', value: 0.03 },
        { axis: 'Listen Radio', value: 0.07 },
        { axis: 'Sending Money', value: 0.18 },
        { axis: 'Other', value: 0.07 },
        { axis: 'Use less Once week', value: 0.08 }
		  ]
    ]

    // Options for the Radar chart, other than default
    var mycfg = {
      w: w,
      h: h,
      maxValue: 0.5,
      levels: 5,
      ExtraWidthX: 200,
      radius: 3
    }

    // Call function to draw the Radar chart
    // Will expect that data is in %'s
    window.RadarChart.draw('#chart', dd, mycfg)
  }

  async loadShadow (url) {
    console.log('shadowing', url)
    let resp = await window.fetch(`http://35.221.159.176:8080/topics?url=${url}`)
    let json = await resp.json()
    console.log(json)
    this.setState({ scores: json.scores, title: json.title, queryURL: url }, () => {
      window.history.pushState({}, '', `/s/${url}`)

      this.renderChart()
    })
  }

  handleChange (e) {
    this.setState({ queryURL: e.target.value })
  }

  render () {
    if (this.state.route.p === '/') {
      const queryURL = this.state.queryURL

      return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
          <img src='/logo.jpg' />
          <form className='min-w-full flex flex-col items-center' onSubmit={this.onSubmit.bind(this)}>
            <input
              className='mt-4 mx-4 shadow appearance-none border rounded w-3/5 xl:w-2/5 py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline'
              type='text'
              placeholder='gov. website URL'
              value={queryURL}
              onChange={this.handleChange.bind(this)} />
            <input
              className='cursor-pointer mt-4 bg-grey-light hover:bg-grey text-grey-darker hover:text-black font-bold py-2 px-4 rounded'
              type='submit'
              value='Search!'
            />
          </form>
          <h1 className='App-title'>{this.state.title}</h1>
        </div>
      )
    }

    if (this.state.route.p === '/s/') {
      return (
        <div className='max-w-lg'>
          <div>
            <h1>{this.state.title}</h1>
            <h2>{this.state.queryURL}</h2>
          </div>
          <div>
            <div className='max-w-xs rounded overflow-hidden shadow-lg my-2'>
              <img className='w-full' src='https://tailwindcss.com/img/card-top.jpg' alt='Sunset in the mountains' />
              <div className='px-6 py-4'>
                <div className='font-bold text-xl mb-2'>The Coldest Sunset</div>
                <p className='text-grey-darker text-base'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
                </p>
              </div>
              <div className='px-6 py-4'>
                <span className='inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2'>#photography</span>
                <span className='inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker mr-2'>#travel</span>
                <span className='inline-block bg-grey-lighter rounded-full px-3 py-1 text-sm font-semibold text-grey-darker'>#winter</span>
              </div>
            </div>
          </div>
          <div id='chart' />
        </div>
      )
    }
  }
}

export default App
