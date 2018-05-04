import React, { Component } from 'react'

class Resources extends Component {
  async componentDidMount () {
    let scores = this.props.scores

    let list = []
    for (let s of scores.slice(0, 3)) {
      console.log(s.id)
      let resp = await fetch(`http://shadow.devpoga.org/topics/${s.id}/resources`)
      let json = await resp.json()
      list = list.concat(json.result)
    }
    console.log(list)
    this.setState({ list })
  }

  render () {
    if (!this.state || !this.state.list) {
      return (
        <div>
          <h1 className='App-title'>loading...</h1>
        </div>
      )
    }

    return (
      <div className='tl'>
        <h1 className='App-title'>{this.state.title}</h1>
        <section className='pa2 pa4-ns'>
          <article className='br2 bg-white pa4 mw6 center'>
            <div>
              <h4 className='f5 fw4 black-60 dib v-mid mv0 mr3'>相關主題</h4>
            </div>
            <ul className='list f6 pl0 mt3 mb0'>
              {this.props.scores.slice(0, 3).map(s => {
                return (
                  <li className='pv2' key={s.id}>
                    <a href={`https://sustainabledevelopment.un.org/${s.id}`} className='link blue lh-title'>
                      <span className='fw7 underline-hover'>{s.name}</span>
                    </a>
                  </li>
                )
              })
              }
            </ul>
          </article>
          <article className='br2 bg-white pa4 mw6 center'>
            <div>
              <h4 className='f5 fw4 black-60 dib v-mid mv0 mr3'>相關資源</h4>
            </div>
            <ul className='list f6 pl0 mt3 mb0'>
              {this.state.list.map(r => {
                return (
                  <li className='pv2' key={r.id}>
                    <a href={r.fields.URL} className='link blue lh-title'>
                      <span className='fw7 underline-hover'>{r.fields.Name}</span>
                      <span className='db black-60'>{r.fields.SDG.join(', ')}</span>
                    </a>
                  </li>
                )
              })
              }
            </ul>
          </article>
        </section>
      </div>
    )
  }
}

export default Resources
