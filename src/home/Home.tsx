import React, { useEffect } from 'react';
import './css/Home.css';
import { useQuery } from '@apollo/client';
import getFeaturedPlanets, { IGetFeaturedPlanetsData } from '../graphql/queries/planets/getFeaturedPlanets';
import { Callout, Classes, InputGroup, Intent, Text } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import getCurrentUser, { IGetCurrentUserData } from '../graphql/queries/users/getCurrentUser';


function Home(): JSX.Element {
  const { loading, data } = useQuery<IGetFeaturedPlanetsData>(getFeaturedPlanets, { errorPolicy: 'all' });
  const { data: userData, loading: userLoading} = useQuery<IGetCurrentUserData>(getCurrentUser);

  useEffect(() => {
    document.title = "starship";
  });

  return (
    <div className="Home">
      <div className="Home-container">
        <div className="Home-header">
          <div className="Home-header-nav">
            <div className="Home-logo"/>
            <InputGroup
              className="Home-search-box"
              placeholder="Search Planets"
              leftIcon="search"
            />
          </div>
          <Callout icon="warning-sign" intent={Intent.WARNING} className="Home-alpha-callout">
            Starship is in an early alpha stage. Expect bugs and unfinished features.
          </Callout>
          {process.env.NODE_ENV === "development" && <Callout icon="warning-sign" intent={Intent.WARNING} className="Home-alpha-callout-padtop">
            This is not a production build. You may encounter performance issues.
          </Callout>}
        </div>
        {userData?.currentUser && <div className="Home-featured">
          <div className="Home-featured-header">Followed Planets</div>
          {!userLoading && <div className="Home-featured-list">
            {userData && userData.currentUser.following && userData.currentUser.following.map((value) => (<Link className="link-button" to={`/planet/` + value.id} key={value.id}>
              <div className="Home-featured-item">
                <Text className="Home-featured-name">{value.name}</Text>
                <Text className="Home-featured-description">{value.description && value.description} </Text>
                <div className="Home-featured-followers">{value.followerCount} {value.followerCount === 1 ? "Follower" : "Followers"}</div>
              </div>
            </Link>))}
          </div>}
          {userLoading && <div className="Home-featured-list">
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
        </div>}
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
