module.exports = (text, user) => {
  return text
    .replace(/\$userId/g, user.id.toString())
    .replace(/\$userFirstName/g, user.first_name)
    .replace(/\$userLastName/g, user.last_name ? user.last_name : '%last name%')
    .replace(/\$userUsername/g, user.username ? user.username : '%username%')
    .replace(/\\n/g, '\n')
}
