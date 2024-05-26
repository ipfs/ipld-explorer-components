import React from 'react'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import ReactJoyride from 'react-joyride'
import { projectsTour } from '../lib/tours'
import AboutIpld from './about/AboutIpld'
import IpldExploreForm from './explore/IpldExploreForm'
import { colorForNode, nameForNode, shortNameForNode } from './object-info/ObjectInfo'

const ExploreSuggestion = ({ cid, name, type }) => (
  <a className='flex items-center lh-copy pl3 pl0-l pv3 bb b--black-10 link focus-outline' href={`#/explore/${cid}`}>
    <span className='flex items-center justify-center w3 h3 w3-m h3-m w3-l h3-l flex-none br-100 tc' style={{ background: colorForNode(type) }}>
      <span className='montserrat fw3 f6 snow' title={nameForNode(type)}>{shortNameForNode(type)}</span>
    </span>
    <span className='pl3 truncate'>
      <h2 className='ma0 fw4 f5 db black montserrat'>{name}</h2>
      <span className='f7 db blue truncate monospace'>{cid}</span>
    </span>
  </a>
)

const StartExploringPage = ({ t, embed, runTour = false, joyrideCallback, links = [] }) => (
  <div className='mw9 center explore-sug-2'>
    <Helmet>
      <title>{t('StartExploringPage.title')}</title>
    </Helmet>
    <div className='flex-l'>
      <div className='flex-auto-l mr3-l'>
        <div className='pl3 pl0-l pt4 pt2-l'>
          <h1 className='f3 f2-l ma0 fw4 montserrat charcoal'>{t('StartExploringPage.header')}</h1>
          <p className='lh-copy f5 avenir charcoal-muted'>{t('StartExploringPage.leadParagraph')}</p>
        </div>
        {embed ? <IpldExploreForm /> : null}
        <ul className='list pl0 ma0 mt4 mt0-l bt bn-l b--black-10'>
        {(links.length > 0)
          ? links.map((suggestion) => (
            <li key={suggestion.cid}>
              <ExploreSuggestion name={suggestion.name} cid={suggestion.cid} type={suggestion.type} />
            </li>
          ))
          : <p className='lh-copy f5 avenir charcoal-muted'>{t('StartExploringPage.noDataAvailable')}</p>}
        </ul>
      </div>
      <div className='pt2-l'>
        <AboutIpld />
      </div>
    </div>

    <ReactJoyride
      run={runTour}
      steps={projectsTour.getSteps({ t })}
      styles={projectsTour.styles}
      callback={joyrideCallback}
      scrollToFirstStep
    />
  </div>
)

export default withTranslation('explore')(StartExploringPage)
