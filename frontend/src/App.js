import React, { Component } from 'react'
import Resources from './resources'
import Progress from './Progress'

class App extends Component {
  constructor () {
    super()
    let path = window.location.pathname
    let route = { p: '/', d: '' }
    let loadingProgress = null

    if (path.startsWith('/s/')) {
      let d = path.replace(/^\/s\//, '')
      route = { p: '/s/', d }
      loadingProgress = 0
    }

    this.state = { queryURL: '', route, scores: [], resourceList: [], loadingProgress }
  }

  componentDidMount () {
    if (this.state.route.p === '/s/') this.loadShadow(this.state.route.d)
  }

  async onSubmit (e) {
    e.preventDefault()

    await this.loadShadow(this.state.queryURL)
  }

  renderChart () {
    let w = 300
    let h = 300

    let data = [this.state.scores.sort((x, y) => {
      if (x.name < y.name) return -1
      if (x.name > y.name) return 1
      return 0
    }).map(s => {
      return { axis: s.name, value: s.score }
    })]

    let config = {
      w: w,
      h: h,
      maxValue: 0.5,
      levels: 5,
      ExtraWidthX: 400,
      radius: 1,
      TranslateX: 200
    }

    window.RadarChart.draw('#chart', data, config)
  }

  async loadShadow (url) {
    console.log('shadowing', url)
    let resp = await window.fetch(`http://35.221.159.176:8080/topics?url=${url}`)
    let json = await resp.json()
    this.setState({ loadingProgress: 40 })
    console.log(json)
    let scores = json.scores
    let resourceList = []
    let i = 0
    for (let s of scores.slice(0, 3)) {
      console.log('loading', s.id)
      let resp = await window.fetch(`http://35.221.159.176:8080/topics/${s.id}/resources`)
      let json = await resp.json()
      resourceList = resourceList.concat(json.result)
      i++
      this.setState({ loadingProgress: 40 + 20 * i })
    }
    console.log(resourceList)
    this.setState({ loadingProgress: null })
    this.setState({ scores: json.scores, title: json.title, queryURL: url, resourceList }, () => {
      window.history.pushState({}, '', `/s/${json.url}`)
      console.log('state update', this.state)

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
        <div className='flex flex-col items-center justify-between min-h-screen'>
          <div className='font-serif pt-2 text-2xl font-bold'>g<span className='font-mono text-xl'>0</span>v shadow</div>
          <div className='w-full mx-auto text-center'>
            <img className='block mx-auto' src='/logo.jpg' />
            <div className='mt-2'>
              <h4 className='font-normal text-grey-dark'>Find Civic Tech Projects from Gov. Website</h4>
            </div>
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
          <div />
        </div>
      )
    }

    if (this.state.route.p === '/s/') {
      if (this.state.loadingProgress !== null) {
        return <div className='font-sans tracking-wide max-w-xl mx-auto mt-8'>
          <Progress percent={this.state.loadingProgress} />
        </div>
      }

      return (
        <div className='font-sans tracking-wide max-w-xl mx-auto'>
          <div className='font-serif pt-2 text-2xl font-bold text-center mb-8'>g<span className='font-mono text-xl'>0</span>v shadow</div>
          <div className='flex flex-row justify-between'>
            <div>
              <h2 className='text-lg font-normal'><a className='no-underline text-grey-darker' href={this.state.queryURL}>{this.state.queryURL}</a></h2>
              <h1 className='inline-block mt-1 text-5xl'><a className='no-underline text-black' href={this.state.queryURL}>{this.state.title}</a></h1>
            </div>
            <div className='mt-2'>
              <h4 className='text-grey-darker'>Links</h4>
              <p className='font-serif text-5xl text-right'>{this.state.resourceList.length}</p>
            </div>
          </div>
          <div className='mt-8 text-center'>
            <h4>Ingredients</h4>
            <div id='chart' className='mx-auto mt-4' style={{ width: 700 }} />
          </div>
          <Resources resourceList={this.state.resourceList} />
        </div>
      )
    }
  }
}

export default App
