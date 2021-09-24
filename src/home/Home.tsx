import React, { useEffect, useState } from 'react';
import './css/Home.css';
import { useQuery } from '@apollo/client';
import getFeaturedPlanets, { IGetFeaturedPlanetsData } from '../graphql/queries/planets/getFeaturedPlanets';
import { Link } from 'react-router-dom';
import getCurrentUser, { IGetCurrentUserData } from '../graphql/queries/users/getCurrentUser';
import { GlobalToaster } from '../util/GlobalToaster';
import PlanetSearch from './PlanetSearch';
import logo from '../assets/images/logo.svg';
import blackLogo from '../assets/images/black-logo.svg';
import Textbox from '../components/input/Textbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';
import Callout from '../components/text/Callout';
import Intent from '../components/Intent';
import { Classes, Text } from '@blueprintjs/core';
import Toasts from '../components/display/Toasts';


function Home(): JSX.Element {
  const { loading, data } = useQuery<IGetFeaturedPlanetsData>(getFeaturedPlanets, { errorPolicy: 'all' });
  const { data: userData, loading: userLoading} = useQuery<IGetCurrentUserData>(getCurrentUser);
  const [searchTextbox, setTextbox] = useState("");
  const [searchText, setText] = useState("");

  useEffect(() => {
    document.title = "starship";
  });

  return (
   <div className="w-full bg-gray-50 dark:bg-gray-900 flex text-black dark:text-white ">
      <div className="w-full m-5 flex flex-col overflow-auto">
        <div>
          <div className="w-full mb-3 flex">
            <img src={logo} alt="logo" className="h-8 hidden dark:block"/>  
            <img src={blackLogo} alt="logo" className="h-8 dark:hidden"/>  
            <div className="ml-auto">
              <FontAwesomeIcon icon={faSearch} size="1x" className="text-gray-700 dark:text-gray-300 mr-2"/>
              <Textbox
                placeholder="Search Planets"
                onChange={(e) => setTextbox(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === "Enter") {
                    if(searchTextbox.length < 3 && searchTextbox !== "") {
                      Toasts.danger("Search term must be at least 3 characters long.");
                    } else {
                      setText(searchTextbox);
                    }
                  }
                }}
                value={searchTextbox}
                small={true}
              />
            </div>
          </div>
          <Callout icon={faExclamationTriangle} intent={Intent.WARNING} className="mb-2">
            Starship is in an early alpha stage. Expect bugs and unfinished features.
          </Callout>
          {process.env.NODE_ENV === "development" && <Callout icon={faExclamationTriangle} intent={Intent.WARNING}>
            This is not a production build. You may encounter performance issues.
          </Callout>}
        </div>
        {searchText === "" && userData?.currentUser && <div className="mt-3">
          <div className="font-bold text-2xl mb-2">Followed Planets</div>
          {!userLoading && <div className="grid grid-cols-auto-md gap-3">
            {userData && userData.currentUser.following && userData.currentUser.following.map((value) => (<Link className="link-button" to={`/planet/` + value.id} key={value.id}>
              <div className="h-48 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg flex flex-col">
                <div className="font-bold text-2xl mb-1 overflow-ellipsis whitespace-nowrap overflow-hidden">{value.name}</div>
                <div className="mb-auto">{value.description && value.description}</div>
                <div className="text-gray-700 dark:text-gray-300">{value.followerCount} {value.followerCount === 1 ? "Follower" : "Followers"}</div>
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
        {searchText === "" && <div className="mt-3">
          <div className="font-bold text-2xl mb-2">Featured Planets</div>
          {!loading && <div className="grid grid-cols-auto-md gap-3">
            {data && data.featuredPlanets.map((value) => (<Link className="link-button" to={`/planet/` + value.id} key={value.id}>
              <div className="h-48 bg-gray-200 dark:bg-gray-800 p-3 rounded-lg flex flex-col">
                <div className="font-bold text-2xl mb-1 overflow-ellipsis whitespace-nowrap overflow-hidden">{value.name}</div>
                <div className="mb-auto">{value.description && value.description}</div>
                <div className="text-gray-700 dark:text-gray-300">{value.followerCount} {value.followerCount === 1 ? "Follower" : "Followers"}</div>
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
        </div>}
        {searchText !== "" && <PlanetSearch searchText={searchText}/>}
        <div className="mt-auto">
          <span className="font-bold">© Starship 2020 - 2021. All rights reserved.</span>
          <span className="block">
            <Link className="font-bold mr-2" to="/terms">Terms</Link>
            <Link className="font-bold mr-2" to="/privacy">Privacy Policy</Link> 
            <Link className="font-bold mr-2" to="/rules">Rules</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Home;
