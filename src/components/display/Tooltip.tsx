import { Transition } from "@tailwindui/react";
import { HTMLProps, useEffect, useState } from "react";
import { usePopper } from "react-popper-2";
import PopperPlacement from "../PopperPlacement";

interface ITooltipProps extends HTMLProps<HTMLDivElement> {
  content: string;
  placement?: PopperPlacement;
  fullWidth?: boolean;
}

function Tooltip(props: ITooltipProps): JSX.Element {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const popper = usePopper(referenceElement, popperElement, {
    placement: props.placement || "bottom",
    modifiers: [
      {
        name: "preventOverflow",
        options: {
          altAxis: true,
          padding: 5,
          altBoundary: true,
          boundary: document.body
        },
      },
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  return (
    <div
      ref={(element) => {
        setReferenceElement(element);
      }}
      className={`${props.fullWidth ? "w-full" : "w-max"}`}
      {...props}
    >
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {props.children}
      </div>
      {open && (
        <Transition
          show={open}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-75"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            ref={(element) => {
              setPopperElement(element);
            }}
            className={`py-2 px-2 bg-gray-100 dark:bg-gray-800 rounded shadow-md text-black dark:text-white`}
            style={popper.styles.popper}
            {...popper.attributes.popper}
          >
            {props.content}
          </div>
        </Transition>
      )}
    </div>
  );
}

export default Tooltip;
