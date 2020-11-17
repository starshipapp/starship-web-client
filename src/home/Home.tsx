import React from 'react';
import './css/Home.css';
import { useQuery } from '@apollo/client';
import getFeaturedPlanets, { IGetFeaturedPlanetsData } from '../graphql/queries/planets/getFeaturedPlanets';
import { Callout, Intent, Text } from '@blueprintjs/core';
import { Link } from 'react-router-dom';


function Home(): JSX.Element {
  const { loading, data } = useQuery<IGetFeaturedPlanetsData>(getFeaturedPlanets, { errorPolicy: 'all' });

  return (
    <div className="Home">
      <div className="Home-container">
        <div className="Home-header">
          <div className="Home-header-branding">Welcome to Starship!</div>
          <Callout icon="warning-sign" intent={Intent.WARNING} title="Here be dragons!" className="Home-alpha-callout">
            Starship is in an early alpha stage. Expect bugs and unfinished features. (including this homepage, which will one day be more focused on your followed planets)<br/>
            If you find a bug, please report it <a href="https://starship.william341.me/planet/kCnATXqBCD4vEvzMB/pekuosDPGGxHKc6Qg">here</a>.
          </Callout>
          <Callout icon="warning-sign" intent={Intent.WARNING} className="Home-alpha-callout-padtop">
            EXPERIMENTAL BUILD! DO NOT SHIP!
            This build is meant to connect to a GraphQL endpoint that is currently not publicly available, and it will not work.
          </Callout>
          {process.env.NODE_ENV === "development" && <Callout icon="warning-sign" intent={Intent.WARNING} className="Home-alpha-callout-padtop">
            This is not a production build. You may encounter performance issues.
          </Callout>}
        </div>
        <div className="Home-featured">
          <div className="Home-featured-header">Featured Planets</div>
          {!loading && <div className="Home-featured-list">
            {data && data.featuredPlanets.map((value) => (<Link to={`/planet/` + value.id} key={value.id}>
              <div className="Home-featured-item">
                <Text className="Home-featured-name">{value.name}</Text>
                <Text className="Home-featured-description">{value.featuredDescription && value.featuredDescription} </Text>
                <div className="Home-featured-followers">{value.followerCount} {value.followerCount === 1 ? "Follower" : "Followers"}</div>
              </div>
            </Link>))}
          </div>}
        </div>
        <div className="Home-footer">
          <span className="Home-footer-copyright">© Starship 2020. All rights reserved.</span>
          <span className="Home-footer-links">
            <a className="Home-footer-link" href="/terms">Terms</a> 
            <a className="Home-footer-link" href="/privacy">Privacy Policy</a> 
            <a className="Home-footer-link" href="/rules">Rules</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Home;
