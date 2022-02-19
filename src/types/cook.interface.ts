export interface CookInterface {
  add: (item: any[]) => void
  capture: () => Promise<any>
  next: () => Promise<any>
  release: (item: any) => void
}