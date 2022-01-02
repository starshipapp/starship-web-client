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
              <div className="text-transparent bg-gray-700 text-xs flex-grow-0 w-max rounded-sm">
                Starship
              </div>
              <div className="text-transparent bg-gray-700 text-2xs flex-grow-0 w-max rounded-sm mt-2">
                Wow, what
              </div>
              <div className="text-transparent bg-gray-700 text-2xs flex-grow-0 w-max rounded-sm mt-2">
                a great
              </div>
              <div className="text-transparent bg-gray-700 text-2xs flex-grow-0 w-max rounded-sm mt-2">
                website!
              </div>
              <div className="text-transparent bg-gray-700 text-2xs flex-grow-0 w-max rounded-sm mt-2">
                You should
              </div>
              <div className="text-transparent bg-gray-700 text-2xs flex-grow-0 w-max rounded-sm mt-2">
                use it!
              </div>
              <div className="text-transparent bg-gray-700 text-2xs flex-grow-0 w-max rounded-sm mt-auto mb-2">
                You, I hope
              </div>
            </div> 
            <div className="h-full mx-auto w-8/12 mt-6">
              <div className="text-transparent bg-gray-700 rounded-sm w-max text-document">
                Welcome!
              </div>
              <div className="text-transparent bg-gray-700 mt-3 text-xs rounded-sm w-max">
                This is some crazy text, but you can't see it.
              </div>
              <div className="text-transparent bg-gray-700 text-xs rounded-sm w-max mt-2">
                What a sad story.
              </div>
              <div className="text-transparent bg-gray-700 text-xs rounded-sm w-max mt-2">
                If only there was some way you could make
              </div>
              <div className="text-transparent bg-gray-700 text-xs rounded-sm w-max mt-2">
                the text more visible. Something like a
              </div>
              <div className="text-transparent bg-gray-700 text-xs rounded-sm w-max mt-2">
                text shadow. Oh, I got it! A HIGHLIGHT
              </div>
              <div className="text-transparent bg-gray-700 text-xs rounded-sm w-max mt-2">
                function. That'd be just genius!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingHeader;
