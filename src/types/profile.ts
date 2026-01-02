export interface ProfileData {
  basicInfo: {
    name: string
    title: string
    bio: string
    avatar: string
  }
  skills: Array<{
    label: string
    value: number
  }>
  experiences: Array<{
    date: string
    title: string
    company: string
    desc: string
  }>
}
