import React, { useEffect } from 'react';
import './css/Home.css';
import { useQuery } from '@apollo/client';
import getFeaturedPlanets, { IGetFeaturedPlanetsData } from '../graphql/queries/planets/getFeaturedPlanets';
import { Callout, Classes, Intent, Text } from '@blueprintjs/core';
import { Link } from 'react-router-dom';


function Home(): JSX.Element {
  const { loading, data } = useQuery<IGetFeaturedPlanetsData>(getFeaturedPlanets, { errorPolicy: 'all' });

  useEffect(() => {
    document.title = "starship";
  });

  return (
    <div className="Home">
      <div className="Home-container">
        <div className="Home-header">
          <div className="Home-header-branding">Welcome to Starship!</div>
          <Callout icon="warning-sign" intent={Intent.WARNING} title="Here be dragons!" className="Home-alpha-callout">
            Starship is in an early alpha stage. Expect bugs and unfinished features. (including this homepage, which will one day be more focused on your followed planets)<br/>
            If you find a bug, please report it <a href="https://starship.william341.me/planet/kCnATXqBCD4vEvzMB/pekuosDPGGxHKc6Qg">here</a>.
          </Callout>
          {process.env.NODE_ENV === "development" && <Callout icon="warning-sign" intent={Intent.WARNING} className="Home-alpha-callout-padtop">
            This is not a production build. You may encounter performance issues.
          </Callout>}
        </div>
        <div className="Home-featured">
          <div className="Home-featured-header">Featured Planets</div>
          {!loading && <div className="Home-featured-list">
            {data && data.featuredPlanets.map((value) => (<Link className="link-button" to={`/planet/` + value.id} key={value.id}>
              <div className="Home-featured-item">
                <Text className="Home-featured-name">{value.name}</Text>
                <Text className="Home-featured-description">{value.featuredDescription && value.featuredDescription} </Text>
                <div className="Home-featured-followers">{value.followerCount} {value.followerCount === 1 ? "Follower" : "Followers"}</div>
              </div>
            </Link>))}
          </div>}
          {loading && <div className="Home-featured-list">
            <div className={`Home-featured-item ${Classes.SKELETON}`}/>
            <div className={`Home-featured-item ${Classes.SKELETON}`}/>
            <div className={`Home-featured-item ${Classes.SKELETON}`}/>
            <div className={`Home-featured-item ${Classes.SKELETON}`}/>
            <div className={`Home-featured-item ${Classes.SKELETON}`}/>
            <div className={`Home-featured-item ${Classes.SKELETON}`}/>
            <div className={`Home-featured-item ${Classes.SKELETON}`}/>
            <div className={`Home-featured-item ${Classes.SKELETON}`}/>
            <div className={`Home-featured-item ${Classes.SKELETON}`}/>
            <div className={`Home-featured-item ${Classes.SKELETON}`}/>
          </div>}
        </div>
        <div className="Home-footer">
          <span className="Home-footer-copyright">© Starship 2020 - 2021. All rights reserved.</span>
          <span className="Home-footer-links">
            <Link className="Home-footer-link" to="/terms">Terms</Link>
            <Link className="Home-footer-link" to="/privacy">Privacy Policy</Link> 
            <Link className="Home-footer-link" to="/rules">Rules</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Home;
