/**
 * Helper function to check if a single image actually loads
 */
export function checkImageLoad(url: string): Promise<boolean> {
    return new Promise((resolve) => {
        // Empty or whitespace-only URLs are invalid
        if (!url) {
            resolve(false)
            return
        }

        const img = new Image()

        img.onload = () => {
            resolve(true) // Image loaded successfully
        }

        img.onerror = () => {
            resolve(false) // Image failed to load (404, broken link, etc)
        }

        img.src = url
    })
}