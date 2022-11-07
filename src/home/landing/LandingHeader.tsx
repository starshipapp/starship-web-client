import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/images/logo.svg';
import Button from '../../components/controls/Button';
import Intent from '../../components/Intent';
import Callout from '../../components/text/Callout';

function LandingHeader(): JSX.Element {
  return (
    <div className="w-screen h-2xl flex flex-col bg-gray-800">
      <div className="flex flex-row justify-between mt-5 max-w-6xl w-3/4 mx-auto align-baseline">
        <img src={logo} alt="logo" className="h-9" />
        <div className="my-auto mr-2">
          <Button
            minimal
          >Features</Button>
          <Button
            minimal
          >Components</Button>
          <Button
            minimal
          >Pricing</Button>
        </div>
        <Button
          className="flex-grow-0 ml-16 my-auto"
          intent={Intent.SUCCESS}
        >Log In</Button>
      </div>
      <Callout
        className="mt-5 w-max mx-auto"
        intent={Intent.WARNING}
        icon={faExclamationTriangle}
      >Starship is currently in open alpha. Some features may be buggy or unfinished.</Callout>
      <div className="flex mx-auto mt-auto">
        <div className="my-auto font-extrabold text-3xl">
          <div className="ml-20 inline-block"></div>
          The place for your
        </div>
        <div className="font-extrabold relative ml-1.5 text-3xl">
          notes<br/>
          community<br/>
          stuff.<br/>
          project<br/>
          homework<br/>
          <div className="absolute w-full h-1/2 bg-gradient-to-t from-transparent to-gray-800 top-0 left-0"/>
          <div className="absolute w-full h-1/2 bg-gradient-to-b from-transparent to-gray-800 bottom-0 left-0"/>
        </div>
      </div>
      <div className="mx-auto mt-16 flex flex-col">
        <Button
          className="flex-grow-0 mb-6 mx-auto"
          intent={Intent.SUCCESS}
          large
        >Sign Up</Button>
        <div className="w-96 h-48 bg-gray-400 rounded-t-md flex">
          <div className="mt-auto mx-auto w-88 rounded-t-md h-44 bg-gray-900 overflow-hidden flex">
            <div className="h-full w-16 bg-gray-800 px-2 pt-2 flex flex-col">
              <div className="text-transparent bg-gray-700 h-3 flex-grow-0 w-10 rounded-full"/>
              <div className="text-transparent bg-gray-700 h-2 flex-grow-0 w-12 rounded-full mt-2"/>
              <div className="text-transparent bg-gray-700 h-2 flex-grow-0 w-8 rounded-full mt-2"/>
              <div className="text-transparent bg-gray-700 h-2 flex-grow-0 w-10 rounded-full mt-2"/>
              <div className="text-transparent bg-gray-700 h-2 flex-grow-0 w-6 rounded-full mt-2"/>
              <div className="text-transparent bg-gray-700 h-2 flex-grow-0 w-10 rounded-full mt-auto mb-2"/>
            </div> 
            <div className="h-full mx-auto w-8/12 mt-6">
              <div className="text-transparent bg-gray-700 h-4 rounded-full w-14 text-document"/>
              <div className="text-transparent bg-gray-700 mt-3 h-3 rounded-full w-48"/>
              <div className="text-transparent bg-gray-700 h-3 rounded-full w-52 mt-2"/>
              <div className="text-transparent bg-gray-700 h-3 rounded-full w-32 mt-2"/>
              <div className="text-transparent bg-gray-700 h-3 rounded-full w-56 mt-2"/>
              <div className="text-transparent bg-gray-700 h-3 rounded-full w-52 mt-2"/>
              <div className="text-transparent bg-gray-700 h-3 rounded-full w-48 mt-2"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingHeader;
