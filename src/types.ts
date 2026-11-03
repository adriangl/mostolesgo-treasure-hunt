export interface Mission {
  id: string
  title: string
  objective: string
  points: number
  searchFilter: string | null
  verification?: string
}

export interface HuntDay {
  id: string
  shortLabel: string
  dateLabel: string
  title: string
  theme: string
  deadline: string
  missions: Mission[]
}

export interface Hunt {
  id: string
  organizer: string
  name: string
  event: string
  dates: string
  location: string
  intro: string
  baseFilter: string
  days: HuntDay[]
  rules: { title: string; body: string }[]
  tieBreakers: string[]
  searchNotes: string[]
}

export interface Progress {
  selectedDayId: string
  completedByDay: Record<string, string[]>
}
