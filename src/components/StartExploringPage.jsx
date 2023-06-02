import React from 'react'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import ReactJoyride from 'react-joyride'

import AboutIpld from './about/AboutIpld'
import IpldExploreForm from './explore/IpldExploreForm'
import { colorForNode, nameForNode, shortNameForNode } from './object-info/ObjectInfo'
import { projectsTour } from '../lib/tours'

const ExploreSuggestion = ({ cid, name, type }) => (
  <a className='flex items-center lh-copy pl3 pl0-l pv3 bb b--black-10 link focus-outline' href={`#/explore/${cid}`}>
    <span className='flex items-center justify-center w3 h3 flex-none br-100 tc' style={{ background: colorForNode(type) }}>
      <span className='montserrat fw2 f4 snow' title={nameForNode(type)}>{shortNameForNode(type)}</span>
    </span>
    <span className='pl3 truncate'>
      <h2 className='ma0 fw4 f5 db black montserrat'>{name}</h2>
      <span className='f7 db blue truncate monospace'>{cid}</span>
    </span>
  </a>
)

const StartExploringPage = ({ t, embed, runTour = false, joyrideCallback }) => (
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
          <li>
            <ExploreSuggestion name='Project Apollo Archives' cid='QmSnuWmxptJZdLJpKRarxBMS2Ju2oANVrgbr2xWbie9b2D' type='dag-pb' />
          </li>
          <li>
            <ExploreSuggestion name='XKCD Archives' cid='QmdmQXB2mzChmMeKY47C43LxUdg1NDJ5MWcKMKxDu7RgQm' type='dag-pb' />
          </li>
          <li>
            <ExploreSuggestion name='HAMT-sharded Wikipedia mirror (>20M files)' cid='bafybeiaysi4s6lnjev27ln5icwm6tueaw2vdykrtjkwiphwekaywqhcjze' type='hamt-sharded-directory' />
          </li>
          <li>
            <ExploreSuggestion name='B-tree search index from ipfs-geoip' cid='bafyreihnpl7ami7esahkfdnemm6idx4r2n6u3apmtcrxlqwuapgjsciihy' type='dag-cbor' />
          </li>
          <li>
            <ExploreSuggestion name='DAG-CBOR Block' cid='bafyreicnokmhmrnlp2wjhyk2haep4tqxiptwfrp2rrs7rzq7uk766chqvq' type='dag-cbor' />
          </li>
          <li>
            <ExploreSuggestion name='Raw Block for "hello"' cid='bafkreibm6jg3ux5qumhcn2b3flc3tyu6dmlb4xa7u5bf44yegnrjhc4yeq' type='raw' />
          </li>
          <li>
            <ExploreSuggestion name='dag-json hello world' cid='baguqeerasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea' type='dag-json' />
          </li>
          <li>
            <ExploreSuggestion name='IGIS Git Repo' cid='baf4bcfg4ep767tjp5lxyanx5urpjjgx5q2volvy' type='git-raw' />
          </li>
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
