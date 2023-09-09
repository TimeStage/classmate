import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')
dayjs.extend(isoWeek)
