interface SelectedArchiveProps {
  file: File | undefined
}
export function SelectedArchive({ file }: SelectedArchiveProps) {
  if (file) {
    return (
      <p className="absolute bottom-10 text-xs font-bold text-amber-500">
        <span className="font-normal"> Arquivo selecionado: </span> {file?.name}
      </p>
    )
  }
}
