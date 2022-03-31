import { faCheck, faHdd, faPaperclip, faShieldAlt, faSmile } from "@fortawesome/free-solid-svg-icons";
import PageHeader from "../../components/layout/PageHeader";
import LandingPricingItem from "./LandingPricingItem";

function LandingPricing(): JSX.Element {
  return (
    <div className="w-2/3 mx-auto pb-12">
      <PageHeader className="mb-6 text-center w-full items-center justify-center">Pricing</PageHeader>
      <div className="flex">
        <div className="flex flex-col w-1/3 bg-gray-800 rounded-lg shadow-lg p-6 pt-8">
          <div className="flex flex-col items-center justify-center mb-2">
            <h1 className="text-4xl font-extrabold text-white">starship</h1>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-center text-3xl font-bold">
              Free
            </div>
            <div className="text-center text-gray-500 text-sm">
              <span>forever</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-4">
            <LandingPricingItem icon={faHdd}>25GB of storage</LandingPricingItem>
            <LandingPricingItem icon={faPaperclip}>8MB attachment size</LandingPricingItem>
            <LandingPricingItem icon={faSmile}>50 custom user emojis</LandingPricingItem>
            <LandingPricingItem icon={faCheck}>Unlimited planets</LandingPricingItem>
            <LandingPricingItem icon={faCheck} last>All components</LandingPricingItem>
          </div>
        </div>
        <div className="flex flex-col w-1/3 bg-gray-800 rounded-lg shadow-lg p-6 pt-8 mx-6 relative overflow-hidden">
          <div className="flex flex-col items-center justify-center mb-2">
            <h1 className="text-4xl font-extrabold text-white">starship+</h1>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-center text-3xl font-bold">
              <span className="text-gray-500">$</span>
              <span className="font-bold">5</span>
            </div>
            <div className="text-center text-gray-500 text-sm">
              <span>per month</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-4">
            <LandingPricingItem icon={faHdd}>75GB of storage</LandingPricingItem>
            <LandingPricingItem icon={faPaperclip}>50MB attachment size</LandingPricingItem>
            <LandingPricingItem icon={faSmile}>500 custom user emojis</LandingPricingItem>
            <LandingPricingItem icon={faShieldAlt} last>Profile badge</LandingPricingItem>
          </div>
          <div className="absolute text-center bg-red-800 text-red-200 top-0 left-0 w-full uppercase font-extrabold text-lg p-1 shadow-lg">
            Coming Soon
          </div>
        </div>
        <div className="flex flex-col w-1/3 bg-gray-800 rounded-lg shadow-lg p-6 pt-8 relative overflow-hidden">
          <div className="flex flex-col items-center justify-center mb-2">
            <h1 className="text-4xl font-extrabold text-white">starship++</h1>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-center text-3xl font-bold">
              <span className="text-gray-500">$</span>
              <span className="font-bold">10</span>
              <span className="text-gray-500">+</span>
            </div>
            <div className="text-center text-gray-500 text-sm">
              <span>per month</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-4">
            <LandingPricingItem icon={faHdd}>150GB of storage</LandingPricingItem>
            <LandingPricingItem icon={faPaperclip}>100MB attachment size</LandingPricingItem>
            <LandingPricingItem icon={faSmile}>4000 custom user emojis</LandingPricingItem>
            <LandingPricingItem icon={faShieldAlt}>Profile badge</LandingPricingItem>
            <div className="justify-center w-full text-center text-gray-400 p-2">
              Starship++ members can purchase additional storage at a rate of $2.50 per 50GB.
            </div>
          </div>
          <div className="absolute text-center bg-red-800 text-red-200 top-0 left-0 w-full uppercase font-extrabold text-lg p-1 shadow-lg">
            Coming Soon
          </div>
        </div>
      </div>
      <div className="flex pt-6">
        <div className="flex flex-col w-1/2 bg-gray-800 rounded-lg shadow-lg p-6 mr-6">
          <div className="">
            <h1 className="text-4xl font-extrabold text-white">Looking for something else?</h1>
          </div> 
          <div className="mt-4 text-document">
            <div className="mb-2">
              Starship does not currently offer special pricing for teams or schools. While we think Starship is great for work (and we already use it), we aren't ready to commit to a team pricing model or enterprise support at this time.
            </div>
            <div>
              If you're still interested after the alpha period, we'd love to hear from you.
            </div>
          </div>
        </div>
        <div className="flex flex-col w-1/2 bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="">
            <h1 className="text-4xl font-extrabold text-white">What if I have a waived cap?</h1>
          </div> 
          <div className="mt-4 text-document">
            <div className="mb-2">
              Users with a waived storage cap may be required to upgrade to a plan that can support their storage usage, or reduce their storage usage to fit within the free tier's storage limits.
            </div>
            <div>
              We have limited resources, so only a select few users will be able to keep the unlimited storage once paid plans roll out. If you're one of these users, you've already been notified.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPricing;
