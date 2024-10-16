/* globals globalThis */
import 'ipfs-css'
import { Buffer } from 'buffer'
import React, { type MouseEvent, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider, useTranslation } from 'react-i18next'
import 'react-virtualized/styles.css'
import 'tachyons'
import i18n from '../src/i18n.js'
import { ExplorePage, StartExploringPage, IpldExploreForm, IpldCarExploreForm, ExploreProvider, HeliaProvider } from '../src/index.js'

globalThis.Buffer = globalThis.Buffer ?? Buffer

const HeaderComponent: React.FC = () => {
  const activeColor = 'navy 0-100'
  const inActiveColor = 'navy o-50'
  const [exploreFormType, setExploreFormType] = useState('cid')
  const [cidColor, setCidColor] = useState(activeColor)
  const [carColor, setCarColor] = useState(inActiveColor)
  const { t } = useTranslation('explore')

  function handleOnChange (evt: MouseEvent<HTMLButtonElement>): void {
    const selectedType = evt.currentTarget.getAttribute('data-value')
    if (selectedType == null) {
      console.error('No data-value attribute found on the button')
      return
    }
    setExploreFormType(selectedType)

    if (selectedType === 'cid') {
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
        <button onClick={handleOnChange} data-value="cid" className={`f6 pointer ph3 pv2 mb2 dib navy bg-aqua ${cidColor} border-navy br2 ba br--left`} aria-current="page">CID</button>
        <button onClick={handleOnChange} data-value="car" className={`f6 pointer ph3 pv2 mb2 dib navy bg-aqua ${carColor} border-navy br2 ba br--right`} aria-current="page">CAR</button>
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

const PageRenderer = (): React.ReactElement => {
  const [route, setRoute] = useState(window.location.hash.slice(1) ?? '/')

  useEffect(() => {
    const onHashChange = (): void => { setRoute(window.location.hash.slice(1) ?? '/') }
    window.addEventListener('hashchange', onHashChange)
    return () => { window.removeEventListener('hashchange', onHashChange) }
  }, [])

  const RenderPage: React.FC = () => {
    switch (true) {
      case route.startsWith('/explore'):
        return <ExplorePage />
      case route === '/':
      default:
        return <StartExploringPage />
    }
  }

  return (
    <RenderPage />
  )
}

const App = (): React.ReactElement => {
  return (
    <HeliaProvider>
      <ExploreProvider>
        <HeaderComponent />
         <PageRenderer />
      </ExploreProvider>
    </HeliaProvider>
  )
}

const rootEl = document.getElementById('root')
if (rootEl == null) {
  throw new Error('No root element found with the id "root"')
}
const root = createRoot(rootEl)
root.render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
)
