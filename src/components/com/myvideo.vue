<template>
    <div :style="stylecss">
        <img v-show="!isReady && poster != ''" :src="poster" style="width:100%;height:100%" />
        <video v-show="isReady || poster == ''" :ref="'video_' + id" :src="src" @canplay="ready()" @ended="ended()"
            muted preload x5-playsinline playsinline="true" wekit-playsinline="true"
            style="width:100%;height:100%"></video>
    </div>
</template>
<script>

export default ({
    created() {
        this.id = parseInt(Math.random() * 1000)
        if (this.vui.isIOS()) {
            document.addEventListener("touchstart", () => {
                if (this.$refs['video_' + this.id]) {
                    if (!this.isReady) {
                        this.$refs['video_' + this.id].play()
                        if (!this.autoplay) {
                            this.$refs['video_' + this.id].pause()
                        }
                    }
                }
            })
        }
    },
    props: {
        src: {
            default: "MyVideo"
        },
        loop: {
            default: true
        },
        autoplay: {
            default: true
        },
        poster: {
            default: ''
        },
        stylecss: {
            default: 'width:100%;height:100%;object-fit:cover;'
        }
    },
    data() {
        return {
            id: 0,
            isReady: false
        }
    },
    methods: {
        ready() {
            this.$emit('ready')
            this.isReady = true
            if (this.loop) {
                this.$refs['video_' + this.id].loop = true
            }
            this.$refs['video_' + this.id].play()
        },
        ended() {
            this.$emit('ended')
        },
        play() {
            var p = this.$refs['video_' + this.id]
            p.currentTime = 0
            this.$refs['video_' + this.id].play()
        }
    }
})
</script>
