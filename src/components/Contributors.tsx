import React from 'react'
import styled from '@xstyled/styled-components'
import { RiUserAddFill } from 'react-icons/ri'

const ContributorsContainer = styled.div`
  justify-content: center;
  display: flex;
  overflow-x: scroll;
  white-space: nowrap;
  overflow-x: visible;
  transition: all 0.3s ease-in-out;
  width: 100%;
  border-bottom: 1;
  border-color: layout-border;
`

const ContributorImage = styled.img`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin-right: 2.5px;
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.25);
  }
`

const ContributorsHeader = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
  border-top: 1; 
  padding-top: 10px;
  border-color: layout-border;
`

export function Contributors(contributors: { contributors: any[] }) {
  return (
    <div>
      <ContributorsHeader>
        <RiUserAddFill size={20}/><span>&nbsp;Page Contributors</span>
      </ContributorsHeader>
      <ContributorsContainer>
        {Array.isArray(contributors.contributors) && contributors.contributors.map((contributor) => (
          <a key={contributor.name} href={`https://github.com/${contributor.name}`} target="_blank" rel="noopener noreferrer">
            <ContributorImage src={contributor.link} alt={contributor.name} />
          </a>
        ))}
      </ContributorsContainer>
    </div>
  )
}