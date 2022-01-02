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
            Starship 0.9
          </div>
        </div>
        {sysData?.sysInfo && <>
          <div className="mt-1 italic text-gray-600 dark:text-gray-300">
            {sysData.sysInfo.serverName} {sysData.sysInfo.version}, schema {sysData.sysInfo.schemaVersion}
          </div>
        </>}
        <div className="mt-auto">
          <span className="Home-footer-copyright">© Starship 2020 - 2022. All rights reserved.</span>
          <span className="Home-footer-links">
            <Link className="Home-footer-link" to="/terms">Terms</Link>
            <Link className="Home-footer-link" to="/privacy">Privacy Policy</Link> 
            <Link className="Home-footer-link" to="/rules">Rules</Link>
          </span>
        </div>
      </PageContainer>
    </Page>
  );
}

export default About;
