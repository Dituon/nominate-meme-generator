export function mix(colorA: number, colorB: number, amount: number){
  return Math.round((colorA * amount) + (colorB * (1 - amount)))
}

export type Rgb = [number, number, number]

export const Red: Rgb = [255, 0, 0]
export const Green: Rgb = [0, 128, 0]
export const Yellow: Rgb = [255, 255, 0]

export function mixRgb(colorA: Rgb, colorB: Rgb, amount: number): Rgb {
  const [ra, ga, ba] = colorA
  const [rb, gb, bb] = colorB
  return [mix(ra, rb, amount), mix(ga, gb, amount), mix(ba, bb, amount)]
}
