import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCheckCircle, faComment, faExclamationTriangle, faLink, faStar } from "@fortawesome/free-solid-svg-icons";

const IconRecord: Record<string, IconProp> = {
  "warning-sign": faExclamationTriangle,
  "star": faStar,
  "tick-circle": faCheckCircle,
  "unresolve": faLink,
  "comment": faComment
};

function IconNameToProp(iconName: string): IconProp {
  return IconRecord[iconName];
}

export default IconNameToProp;