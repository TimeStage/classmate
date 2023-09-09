export function toWeekDay(stringWeekDay: string) {
  const lowerCaseString = stringWeekDay.toLocaleLowerCase()

  switch (lowerCaseString) {
    case 'dom':
      return 0
    case 'seg':
      return 1
    case 'ter':
      return 2
    case 'qua':
      return 3
    case 'qui':
      return 4
    case 'sex':
      return 5
    case 'sab':
      return 6
    default:
      return 2
  }
}
