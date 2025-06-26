export const waitUntil = async (conditionFn: () => boolean, checkInterval = 50) => {
    while (!conditionFn()) {
        await new Promise(resolve => setTimeout(resolve, checkInterval))
    }
}
