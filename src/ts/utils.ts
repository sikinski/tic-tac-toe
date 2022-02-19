export const loadImage = async (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = src
        image.addEventListener('load', () => resolve(image), { once: true })
        image.addEventListener('load', reject, { once: true })
    })
}
