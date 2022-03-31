import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLProps } from "react";

interface ILandingPricingItemProps extends HTMLProps<HTMLDivElement> {
  icon: IconProp;
  last?: boolean;
}

function LandingPricingItem(props: ILandingPricingItemProps): JSX.Element {
  return (
    <div className={`text-white w-full p-3 ${props.last ? "" : "border-b border-gray-600"} flex`}>
      <div className="my-auto">
        <FontAwesomeIcon icon={props.icon} className="text-gray-400"/>
      </div>
      <div className="mx-auto">
        {props.children}
      </div>
    </div> 
  );
}

export default LandingPricingItem;
