const _decodeHtmlEntities = (text) => {
  const htmlEntities = {
    '&Aacute;': 'Á',
    '&Eacute;': 'É',
    '&Iacute;': 'Í',
    '&Oacute;': 'Ó',
    '&Uacute;': 'Ú',
    '&aacute;': 'á',
    '&eacute;': 'é',
    '&iacute;': 'í',
    '&oacute;': 'ó',
    '&uacute;': 'ú',
    '&Ntilde;': 'Ñ',
    '&ntilde;': 'ñ'
  }
  if (!text) return text
  return text.replace(/&[A-Za-z]+;/g, match => htmlEntities[match] || match)
}

const _alwaysUppercase = ['USB', 'LED', 'ID', 'mAh', 'GB', 'TB', 'HD', 'TV']

export const formatText = (text, isUpperCase = false) => {
  const decodedText = _decodeHtmlEntities(text)
  if (!decodedText) return ''
  
  if (isUpperCase) {
    const words = decodedText.toLowerCase().split(' ')
    return words
      .map(word => _alwaysUppercase.includes(word.toUpperCase()) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  return decodedText
}

export const cleanText = (text) => {
  if (!text) return ''
  return text.replace(/\\?"/g, '').trim()
}
