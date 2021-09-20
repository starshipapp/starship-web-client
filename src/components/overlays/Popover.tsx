import { Transition } from "@tailwindui/react";
import { HTMLProps, useEffect, useState } from "react";
import { usePopper } from "react-popper-2";
import PopperPlacement from "../PopperPlacement";
import ClickAwayListener from 'react-click-away-listener';

interface IPopoverProps extends HTMLProps<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  popoverTarget: JSX.Element;
  placement?: PopperPlacement;
  fullWidth?: boolean;
}

function Popover(props: IPopoverProps): JSX.Element {
  const { open, onClose, popoverTarget, ...rest } = props;
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const popper = usePopper(referenceElement, popperElement, {
    placement: props.placement || "bottom",
    modifiers: [
      {
        name: "preventOverflow",
        options: {
          altAxis: true,
          padding: 5,
          altBoundary: true,
          
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

  const exitFunction = (e?: KeyboardEvent): void => {
    if(e && e.key === 'Escape'){
      if (onClose) {
        onClose();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", exitFunction, false);

    return () => {
      document.removeEventListener("keydown", exitFunction, false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={(element) => {
        setReferenceElement(element);
      }}
      className={`${props.fullWidth ? "w-full" : "w-max"}`}
      {...rest}
    >
      {popoverTarget}
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
          <ClickAwayListener onClickAway={() => {
            if (onClose) {
              onClose();
            }
          }}>
            <div
              ref={(element) => {
                setPopperElement(element);
              }
              }
              style={popper.styles.popper}
              {...popper.attributes.popper}
            >
              <div className={`py-2 px-2 bg-gray-200 dark:bg-gray-700 rounded-sm shadow-md text-black dark:text-white ${props.className ?? ""}`}>
                {props.children}
              </div>
            </div>
          </ClickAwayListener>
        </Transition>
      )}
    </div>
  );
}

export default Popover;