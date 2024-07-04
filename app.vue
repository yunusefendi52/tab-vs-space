<template>
  <span>tab: {{ data?.tab }}</span>
  <br>
  <button @click="() => vote('tab')">vote for tab</button>
  <br>
  <br>
  <span>space: {{ data?.space }}</span>
  <br>
  <button @click="() => vote('space')">vote for space</button>
  <br>
  <br>
  <span v-if="voteStatus === 'loading'">loading</span>
</template>

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