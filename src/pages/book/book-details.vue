<template>
    <div class="defaultForm">
        <div class="title">
            {{dataForm.bookName}}
        </div>
        <div class="author">
            <el-link :underline="false" @click="gotoAuthorDetails(dataForm.authorId)">{{dataForm.authorName}}</el-link>
        </div>
        <div class="intro">{{dataForm.introduction}}</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dataForm: {
                    id: '',
                    bookName: '',
                    introduction: '',
                }
            };
        },
        created() {
            this.initData();
        },
        methods: {
            gotoBookRead(id) {
                this.$router.push("/book/book-read/" + id);
            },
            gotoAuthorDetails(id) {
                this.$router.push("/book/author-details/" + id);
            },
            initData() {
                // 详情
                let id = this.$route.params.id;
                this.getRequest('/ms-book-manager/api/book/details', {id: id}).then(resp => {
                    if (resp && !resp.status) {
                        this.dataForm = resp;
                    }
                })

            }
        }
    }
</script>

<style scoped>
    .defaultForm {
        width: 94%;
        margin-top: 25px;
        margin-left: 30px;
    }

    .avatar {
        width: 92px;
        display: block;
    }

    .time {
        font-size: 13px;
        color: #999;
    }

    .title {
        text-align: center;
        font-size: 24px;
        font-weight: bold
    }

    .intro {
        margin-top: 10px;
        font-size: 13px;
        color: #b1aeae;
    }

    .author {
        margin-top: 10px;
        text-align: center;
    }

</style>