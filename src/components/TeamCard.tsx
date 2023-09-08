interface TeamCardProps {
  teamName: string
  courseName?: string
}

export function TeamCard({ teamName, courseName }: TeamCardProps) {
  return (
    <div className="flex justify-center items-center max-w-xs px-10 py-5 gap-5 bg-amber-500 rounded-md text-gray-100 font-roboto hover:opacity-70 cursor-pointer">
      <p className="font-bold text-2xl">{teamName}</p>
      <span className="text-xl ">{courseName}</span>
    </div>
  )
}
