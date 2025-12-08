import { checkImageLoad } from '@/methods/validations/checkImageLoad'
import { ref, onMounted, type Ref } from 'vue'

/**
 * Image Validation Composable
 * 
 * Validates one or multiple image URLs by actually attempting to load them
 * Returns boolean to determine whether to show image or placeholder
 * 
 * Usage:
 * - Single image: useImageValidation(url)
 * - Multiple images: useImageValidation(url1, url2, url3, ...)
 * 
 * Validates by:
 * 1. Checking if URL is non-empty
 * 2. Actually attempting to load the image
 * 3. Returns true only if image successfully loads
 */

interface ImageValidationResult {
    hasValidImage: Ref<boolean>
    primaryImage: Ref<string>
    isLoading: Ref<boolean>
}



/**
 * Validates one or multiple image URLs
 * Uses rest parameters (...imageUrls) to accept any number of arguments
 */
export function useImageValidation(...imageUrls: string[]): ImageValidationResult {
    // Trim all URLs upfront
    const trimmedUrls = imageUrls.map(url => url.trim())

    const hasValidImage = ref(false) // Is there a valid image?
    const primaryImage = ref('') // which image is valid?
    const isLoading = ref(true) // are we still checking?

    onMounted(async () => {
        // Check all images in parallel
        const validationResults = await Promise.all(
            trimmedUrls.map(url => checkImageLoad(url))
        )

        // Find the first valid image
        const firstValidIndex = validationResults.findIndex(isValid => isValid)

        if (firstValidIndex !== -1) {
            hasValidImage.value = true
            primaryImage.value = trimmedUrls[firstValidIndex]?.trim() ?? ''
        } else {
            hasValidImage.value = false
            primaryImage.value = ''
        }

        isLoading.value = false
    })

    return {
        hasValidImage,
        primaryImage,
        isLoading
    }
}