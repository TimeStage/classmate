interface TeamCardProps {
  teamName: string
  courseName?: string
}

export function TeamCard({ teamName, courseName }: TeamCardProps) {
  return (
    <div className="flex max-w-xs cursor-pointer items-center justify-center gap-5 rounded-md bg-amber-500 px-10 py-5 font-roboto text-gray-100 hover:opacity-70">
      <p className="text-2xl font-bold">{teamName}</p>
      <span className="text-xl ">{courseName}</span>
    </div>
  )
}
