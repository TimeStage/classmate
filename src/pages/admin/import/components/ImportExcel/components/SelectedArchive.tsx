interface SelectedArchiveProps {
  file: File | undefined
}
export function SelectedArchive({ file }: SelectedArchiveProps) {
  if (file) {
    return (
      <p className="text-amber-500 font-bold text-xs absolute bottom-10">
        <span className="font-normal"> Arquivo selecionado: </span> {file?.name}
      </p>
    )
  }
}
