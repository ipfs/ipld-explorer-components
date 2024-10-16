// @vitest-environment jsdom
/* global describe expect */
import { render, screen } from '@testing-library/react'
import { CID } from 'multiformats/cid'
import React from 'react'
import '@testing-library/jest-dom'
import GraphCrumb, { type PathBoundary } from './GraphCrumb'

// Mock CID
const mockCid = CID.parse('QmYPNmahJAvkMTU6tDx5zvhEkoLzEFeTDz6azDCSNqzKkW')
const mockCidChild1 = CID.parse('zb2rhZMC2PFynWT7oBj7e6BpDpzge367etSQi6ZUA81EVVCxG')
const mockCidChild2 = CID.parse('zB7NbGN5wyfSbNNNwo3smZczHZutiWERdvWuMcHXTj393RnbhwsHjrP7bPDRPA79YWPbS69cZLWXSANcwUMmk4Rp3hP9Y')
const mockCidChild3 = CID.parse('bafkqaaik')

// Mock PathBoundaries
const mockPathBoundaries: PathBoundary[] = [
  { path: 'path1', source: mockCid, target: mockCidChild1 },
  { path: 'path2', source: mockCidChild1, target: mockCidChild2 },
  { path: 'path3', source: mockCidChild2, target: mockCidChild3 },
  { path: 'path4', source: mockCidChild3, target: mockCid }
]

describe('GraphCrumb Component', () => {
  test('renders correctly with given props', () => {
    render(<GraphCrumb cid={mockCid} pathBoundaries={mockPathBoundaries} localPath="http://localhost:3000/"/>)
    expect(screen.getByTitle(mockCid.toString())).toBeInTheDocument()
    expect(screen.getByText('path1')).toBeInTheDocument()
    expect(screen.getByText('path2')).toBeInTheDocument()
    expect(screen.getByText('path3')).toBeInTheDocument()
    expect(screen.getByText('path4')).toBeInTheDocument()
  })
})
