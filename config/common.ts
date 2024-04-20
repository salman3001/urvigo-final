import env from '#start/env'

const commonConfig = {
  rowsPerPage: 20,
  mail_address_info: 'info@urvigo.com',
  uploadPath: env.get('UPLOAD_PATH', 'temp'),
}

export default commonConfig
