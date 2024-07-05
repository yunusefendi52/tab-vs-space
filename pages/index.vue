<template>
    <div>
        <h1>Tab vs Space</h1>
        <span class="label">Tab: {{ data?.tab }}</span>
        <br>
        <button @click="() => vote('tab')">Vote for Tab</button>
        <br>
        <br>
        <span class="label">Space: {{ data?.space }}</span>
        <br>
        <button @click="() => vote('space')">Vote for Space</button>
        <br>
        <span v-if="voteStatus === 'loading'">loading</span>
    </div>
</template>

<style scoped>
.label {
    font-size: 1.5em;
}
</style>

<script setup lang="ts">
const { data, refresh } = await useFetch('/api/data')
watchEffect(() => {
    var run = true
    const runAsync = async () => {
        while (run) {
            await new Promise(r => setTimeout(() => r(undefined), 5000))
            refresh()
        }
    }
    runAsync()
    return () => {
        run = false
    }
})

const voteStatus = ref<'loading' | 'none'>('none')
const vote = async (value: 'tab' | 'space') => {
    if (voteStatus.value === 'loading') {
        return
    }
    voteStatus.value = 'loading'
    try {
        await $fetch.raw('/api/vote', {
            query: {
                vote: value,
            },
            method: 'post'
        })
        await refresh()
    } finally {
        voteStatus.value = 'none'
    }
}
</script>