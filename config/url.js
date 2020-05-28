import env from './env'

const DEV_URL = '//test.zone.bz.cn'
const PRO_URL = '//zone.bz.cn'

export default env === 'development' ? DEV_URL : PRO_URL
