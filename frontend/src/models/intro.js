export const INTRO_KEY = "royal:intro";

export function shouldPlayIntro({ reducedMotion, scrollY, seen, hasCrown }) {
  return !reducedMotion && scrollY <= 80 && !seen && hasCrown;
}
