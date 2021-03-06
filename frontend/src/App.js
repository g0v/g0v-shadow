import React, { Component } from 'react'
import Links from './Links'
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

    this.state = { queryURL: '', route, scores: [], resourceList: [], loadingProgress, loadError: false }
  }

  componentDidMount () {
    if (this.state.route.p === '/s/') this.loadShadow(this.state.route.d)
  }

  async onSubmit (e) {
    e.preventDefault()
    this.setState({ loadError: false })
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
    try {
      console.log('shadowing', url)
      let resp = await window.fetch(`https://devpoga.org/shadow/topics?url=${url}`)
      let json = await resp.json()
      let route = { p: '/s/', d: url }
      this.setState({ route, loadingProgress: 40 })
      console.log(json)
      let scores = json.scores
      let resourceList = []
      let i = 0
      for (let s of scores.slice(0, 3)) {
        console.log('loading', s.id)
        let resp = await window.fetch(`https://devpoga.org/shadow/topics/${s.id}/resources`)
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
    } catch (e) {
      this.setState({ loadError: true })
    }
  }

  handleChange (e) {
    this.setState({ queryURL: e.target.value })
  }

  render () {
    if (this.state.route.p === '/') {
      const queryURL = this.state.queryURL

      return (
        <div className='flex flex-col items-center justify-between min-h-screen tracking-wide'>
          <a className='no-underline text-black' href='/'><div className='font-serif pt-2 text-2xl font-bold'>g<span className='font-mono text-xl'>0</span>v shadow</div></a>
          <div className='w-full mx-auto text-center'>
            <img className='block mx-auto' src='/logo.jpg' />
            <div className='mt-2'>
              <h4 className='font-normal text-grey-dark'>Find Civic Tech Projects related to Gov. Website</h4>
            </div>
            <form className='min-w-full flex flex-col items-center' onSubmit={this.onSubmit.bind(this)}>
              <input
                className={`text-center mt-4 mx-4 shadow appearance-none border rounded w-3/5 xl:w-2/5 py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline ${this.state.loadError ? 'bg-red-lighter' : ''}`}
                type='text'
                placeholder='gov. website URL'
                value={queryURL}
                onChange={this.handleChange.bind(this)} />
              {this.state.loadError ? <div className='my-4 text-red'>Failed to load given URL.</div> : ''}
              <input
                className='cursor-pointer mt-4 bg-grey-light hover:bg-grey text-grey-darker hover:text-black font-bold py-2 px-4 rounded'
                type='submit'
                value='Search!'
              />
            </form>
            <h1 className='App-title'>{this.state.title}</h1>
          </div>
          <div className='text-grey-dark mb-2'>
            <a href='https://g0v.tw/' className='text-grey-dark no-underline'>g0v.tw</a> <span className='text-grey-darker'>/</span> <a href='https://airtable.com/invite/l?inviteId=invlV3IHHywKx24B1&inviteToken=e4f6f52aefab15cb28b6cb734222bd0f4267e05b07b926eac83bee334ef6ef67' className='text-grey-dark no-underline' >submit your project</a> <span className='text-grey-darker'>/</span> <a className='no-underline text-grey-dark' href='https://github.com/g0v/g0v-shadow'>github</a>
          </div>
        </div>
      )
    }

    if (this.state.route.p === '/s/') {
      if (this.state.loadingProgress !== null) {
        return <div className='font-sans tracking-wide max-w-xl mx-auto'>
          <a className='no-underline text-black' href='/'><div className='font-serif pt-2 text-2xl font-bold text-center mb-8'>g<span className='font-mono text-xl'>0</span>v shadow</div></a>
          <Progress percent={this.state.loadingProgress} />
        </div>
      }

      return (
        <div className='font-sans tracking-wide max-w-xl mx-auto'>
          <a className='no-underline text-black' href='/'><div className='font-serif pt-2 text-2xl font-bold text-center mb-8'>g<span className='font-mono text-xl'>0</span>v shadow</div></a>
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
            <h4 className='uppercase'>Ingredients</h4>
            <div id='chart' className='mx-auto mt-4' style={{ width: 700 }} />
          </div>
          <Links resourceList={this.state.resourceList} />
          <div className='text-center text-grey-dark my-8'>
            <a href='https://g0v.tw/' className='text-grey-dark no-underline'>g0v.tw</a> <span className='text-grey-darker'>/</span> <a href='https://airtable.com/invite/l?inviteId=invlV3IHHywKx24B1&inviteToken=e4f6f52aefab15cb28b6cb734222bd0f4267e05b07b926eac83bee334ef6ef67' className='no-underline text-grey-dark'>submit your project</a> <span className='text-grey-darker'>/</span> <a className='no-underline text-grey-dark' href='https://github.com/g0v/g0v-shadow'>github</a>
          </div>
        </div>
      )
    }
  }
}

export default App
