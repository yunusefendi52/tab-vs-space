import { voteSpace, voteTab } from "./vote.post"

export default defineEventHandler(async event => {
    return {
        tab: voteTab,
        space: voteSpace,
    }
})