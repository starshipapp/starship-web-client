import { useQuery } from "@apollo/client";
import getSysInfo, { IGetSysInfoData } from "../graphql/queries/misc/getSysInfo";
import { Link } from "react-router-dom";
import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import logo from '../assets/images/logo.svg';
import blackLogo from '../assets/images/black-logo.svg';

function About(): JSX.Element {
  const {data: sysData} = useQuery<IGetSysInfoData>(getSysInfo);

  return (
    <Page>
      <PageContainer className="h-full flex flex-col">
        <div className="mt-6 mb-2">
          <img src={logo} alt="logo" className="h-12 hidden dark:block"/>  
          <img src={blackLogo} alt="logo" className="h-12 dark:hidden"/>  
        </div>
        <div className="flex">
          <div className="text-3xl font-extrabold">
            Starship 0.10
          </div>
        </div>
        {sysData?.sysInfo && <>
          <div className="mt-1 italic text-gray-600 dark:text-gray-300">
            server: {sysData.sysInfo.serverName} {sysData.sysInfo.version}, schema: {sysData.sysInfo.schemaVersion}
          </div>
        </>}

        <div className="mt-auto">
          <div className="font-bold">Starship is an open-source project.</div>
          
          <p className="mt-2">
            starship-server is licensed under the Affero GPL, version 3.<br/>
            The source code is available <a href="https://github.com/starshipapp/starship-server">on GitHub.</a><br/>
            For more information on your rights, you may read <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">the full text of the Affero GPL license.</a>
          </p>

          <p className="mt-2">
            starship-web-client is licensed under the Apache License, version 2.<br/>
            The source code is available <a href="https://github.com/starshipapp/starship-web-client">on GitHub.</a><br/>
            For more information, you may read <a href="https://www.apache.org/licenses/LICENSE-2.0">the full text of the Apache License.</a>
          </p>
        </div>


        <div className="mt-2">
          <span className="font-bold">© Starship 2020 - 2022. All rights reserved.</span>
          <span className="block">
            <Link className="font-bold mr-2" to="/terms">Terms</Link>
            <Link className="font-bold mr-2" to="/privacy">Privacy Policy</Link> 
            <Link className="font-bold mr-2" to="/rules">Rules</Link>
          </span>
        </div>
      </PageContainer>
    </Page>
  );
}

export default About;
