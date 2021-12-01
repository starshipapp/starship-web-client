import { Transition } from "@tailwindui/react";
import { useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { usePopper } from "react-popper-2";

interface IContextMenuProps extends React.HTMLProps<HTMLDivElement> {
  menu: JSX.Element;
  fullWidth?: boolean;
}

let x = 0;
let y = 0;

const virtualReference = {
    getBoundingClientRect() {
      return {
        top: y,
        left: x,
        bottom: 0,
        right: 0,
        width: 90,
        height: 10,
      };
    },
  };

function ContextMenu(props: IContextMenuProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const popper = usePopper(virtualReference, popperElement, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "preventOverflow",
        options: {
          altAxis: true,
          altBoundary: true,
          boundary: document.body,
          padding: 5
        },
      }
    ],
  });

  const exitFunction = (e?: KeyboardEvent): void => {
    if(e && e.key === 'Escape'){
      setIsOpen(false);
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
    <>
      <div
        className={`${props.fullWidth ? "w-full" : "w-max"}`}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpen(true);
          x = e.clientX;
          y = e.clientY;
        }}
      >  
        {props.children}
      </div>
      <ClickAwayListener onClickAway={() => setIsOpen(false)}>
         <div
          className="absolute z-40"
         >
          {isOpen && <Transition
            show={isOpen}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div 
              {...props} 
              className={`py-2 bg-gray-100 dark:bg-gray-800 rounded shadow-md text-black dark:text-white w-48 ${props.className ?? ""}`}

              style={popper.styles.popper}
              ref={(element) => {
                setPopperElement(element);
              }}
              {...popper.attributes.popper}
            >
              {props.menu}
            </div> 
          </Transition>}
         </div>
      </ClickAwayListener>
    </>
  );
}

export default ContextMenu;
