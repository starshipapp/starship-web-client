export default function isMobile(): boolean {
  if(window.matchMedia("only screen and (max-width: 600px)").matches){
    // The viewport is less than 768 pixels wide
    return true;
  }
  return false;
}