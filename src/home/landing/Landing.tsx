import LandingHeader from "./LandingHeader";
import LandingIntroduction from "./LandingIntroduction";
import LandingPricing from "./LandingPricing";
import LandingUseCases from "./LandingUseCases";

function Landing(): JSX.Element {
  return (
    <div className="text-white flex-col h-screen w-screen overflow-x-hidden overflow-y-scroll">
      <LandingHeader/>
      <LandingIntroduction/>
      <LandingUseCases/>
      <LandingPricing/>
    </div>
  );
}

export default Landing;
