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
        <div id="cf-turnstile"></div>
    </div>
</template>

<style scoped>
.label {
    font-size: 1.5em;
}
</style>

<script setup lang="ts">
const { data, refresh } = await useFetch('/api/data')
var run = ref(true)

if (import.meta.client) {
    onMounted(() => {
        const visibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log('showed')
                run.value = true
            } else {
                console.log('hidden')
                run.value = false
            }
        }
        document.addEventListener('visibilitychange', visibilityChange)
        return () => {
            document.removeEventListener('visibilitychange', visibilityChange)
        }
    })
}
watchEffect(() => {
    const runAsync = async () => {
        while (true) {
            if (!run.value) {
                break
            }
            await new Promise(r => setTimeout(() => r(undefined), 15000))
            refresh()
        }
    }
    runAsync()
    return () => {
        run.value = false
    }
})

const { public: { TURNSTILE_SITE_KEY } } = useRuntimeConfig()

const voteStatus = ref<'loading' | 'none'>('none')
const vote = async (value: 'tab' | 'space') => {
    if (voteStatus.value === 'loading') {
        return
    }
    voteStatus.value = 'loading'
    try {
        const cfToken = await getToken()
        if (!cfToken) {
            return
        }

        await $fetch.raw('/api/vote', {
            query: {
                vote: value,
                token: cfToken,
            },
            method: 'post'
        })
        await refresh()
    } finally {
        voteStatus.value = 'none'
    }
}

const getToken = async () => {
    return new Promise<string>(r => {
        // @ts-ignore
        turnstile.ready(function () {
            // @ts-ignore
            turnstile.render('#cf-turnstile', {
                sitekey: TURNSTILE_SITE_KEY,
                callback: function (token: string) {
                    r(token)
                },
            });
        });

        setTimeout(() => {
            console.error('Timeout get token')
            r('')
        }, 15000)
    })
}
</script>