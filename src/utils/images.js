export const constructImagesPromos = (children, mainImage) => {
  const images = []
  if (children) {
    children.forEach(child => {
      if (child?.imagenesHijo) {
        child?.imagenesHijo.forEach(image => {
          images.push(image)
        })
      }
    })
  }
  if (mainImage.length > 0) {
    images.push(mainImage[0])
  }
  return images
}
