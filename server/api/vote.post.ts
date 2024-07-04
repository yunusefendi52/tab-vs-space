export var voteTab = 0
export var voteSpace = 0

export default defineEventHandler(async event => {
    const { vote } = getQuery(event)
    if (vote === 'tab') {
        voteTab++
    } else if (vote === 'space') {
        voteSpace++
    } else {
        throw createError({
            message: 'Your vote counts (as if)',
            statusCode: 400,
        })
    }
    return {
        tab: voteTab,
        space: voteSpace,
    }
})