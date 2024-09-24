/* globals globalThis */
import { Buffer } from 'buffer'
import 'ipfs-css'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { I18nextProvider, withTranslation } from 'react-i18next'
import 'react-virtualized/styles.css'
import 'tachyons'
import '../src/components/loader/Loader.css'
import '../src/components/object-info/LinksTable.css'
import i18n from '../src/i18n.js'
import { ExplorePage, StartExploringPage, IpldExploreForm, IpldCarExploreForm, ExploreProvider, HeliaProvider, useHelia } from '../src/index.js'
// import { ExploreProvider } from '../src/providers/explore.jsx'
// import { HeliaProvider } from '../src/providers/helia.jsx'

globalThis.Buffer = Buffer

const HeaderComponent = ({ t }) => {
  const activeColor = 'navy 0-100'
  const inActiveColor = 'navy o-50'
  const [exploreFormType, setExploreFormType] = useState('cid')
  const [cidColor, setCidColor] = useState(activeColor)
  const [carColor, setCarColor] = useState(inActiveColor)

  function handleOnChange (evt) {
    setExploreFormType(evt.target.value)
    if (evt.target.value === 'cid') {
      setCidColor(activeColor)
      setCarColor(inActiveColor)
    } else {
      setCidColor(inActiveColor)
      setCarColor(activeColor)
    }
  }

  return (
    <header className='flex-l items-center pa3 bg-navy bb bw3 border-aqua tc tl-l'>
      <a href='#/' title={t('homeLink')} className='flex-none v-mid'>
        {/* <img src={ipfsLogo} alt='IPFS' style={{height: 50, width: 117.5}} /> */}
      </a>
      <div className='btn-group ph1 ph3-l pt1'>
        <button onClick={handleOnChange} value="cid" className={`f6 pointer ph3 pv2 mb2 dib navy bg-aqua ${cidColor} border-navy br2 ba br--left`} aria-current="page">CID</button>
        <button onClick={handleOnChange} value="car" className={`f6 pointer ph3 pv2 mb2 dib navy bg-aqua ${carColor} border-navy br2 ba br--right`} aria-current="page">CAR</button>
      </div>
      <div className='flex-auto ph2 ph0-l pt1'>
        <div style={{ maxWidth: 560 }} className='center-m'>
          {exploreFormType === 'cid' ? <IpldExploreForm /> : <IpldCarExploreForm />}
        </div>
      </div>
      <div className='pt2 pt0-l ma0 inline-flex items-center'>
        <h1 className='f3 fw2 montserrat aqua ttu'>{ t('appName') }</h1>
        <div className='pl3'>
          <a href='https://github.com/ipld/explore.ipld.io' target='_blank' rel="noopener noreferrer" aria-label='View source on GitHub'>
            <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 32.58 31.77'>
              {/* SVG content */}
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}

const TranslatedHeaderComponent = withTranslation('explore')(HeaderComponent)

const PageRenderer = () => {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/')

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.slice(1) || '/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const renderPage = () => {
    switch (true) {
      case route.startsWith('/explore'):
        return <ExplorePage />
      case route === '/':
      default:
        return <StartExploringPage />
    }
  }

  return (
    <HeliaProvider>
      <ExploreProvider>
        {renderPage()}
      </ExploreProvider>
    </HeliaProvider>
  )
}

const App = () => {
  return (
    <HeliaProvider>
      <ExploreProvider>
        <TranslatedHeaderComponent />
         <PageRenderer />
      </ExploreProvider>
    </HeliaProvider>
  )
}


ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>,
  document.getElementById('root')
)
