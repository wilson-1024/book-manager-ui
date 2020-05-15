<template>
    <div class="defaultForm">
        <el-tabs v-model="activeName" tabPosition="left">
            <el-tab-pane label="作者信息" name="info">
                <div style="margin-top:15px">{{dataForm.name}}</div>
                <div style="margin-top:15px">{{dataForm.introduction}}</div>
                <div style="margin-top:35px">
                    <el-button @click="$router.back(-1)" size="mini">返回</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="作品列表" name="book">
                <div class="book-item" v-for="book in books" :key="book.id">
                    <div class="img"><img width="90" :src="config.handleImgUri(book.imgUrl)" ></div>
                    <div class="content">
                        <div style="height:30px">
                            <div class="title">{{book.bookName}}</div>
                            <div class="category">
                                <el-tag type="success" size="mini">{{ book.wordCount }} 万字</el-tag>
                            </div>
                        </div>
                        <div class="introduction">
                            {{book.introduction}}
                        </div>
                        <div class="author">
                            <el-button type="text" class="button" @click="gotoBookDetails(book.id)">查看</el-button>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeName: 'info',
                imageUrl:'',
                books:[],
                dataForm: {
                    id:'',
                    name: '',
                    introduction: '',
                }
            };
        },
        created(){
            this.initData();
        },
        methods: {
            gotoBookDetails(id){
                this.$router.push("/book/book-details/"+id);
            },
            initData(){
                // 详情
                let id = this.$route.params.id;
                this.getRequest('/ms-book-manager/api/bookAuthor/details', {id:id}).then(resp => {
                    if (resp && !resp.status) {
                        this.dataForm = resp;
                        this.dataForm.attachmentIds = [];}
                })

                // 图书列表
                let form = {
                    pageNum:1,
                    pageSize:10000,
                    authorId:id
                }
                this.getRequest('/ms-book-manager/api/book/getList', form).then(resp => {
                    if (resp && !resp.status) {
                        this.books = resp;
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
        margin-left: 10px;
    }

    .avatar {
        width: 128px;
        height: 128px;
        display: block;
    }

    .time {
        font-size: 13px;
        color: #999;
    }
    
    .book-item{
        height: 130px;
        margin-bottom: 20px
    }
    .book-item .img{
        float:left;width:16%
    }
    .book-item .content{
        float:left; width:84%
    }
    .book-item .content .title{
        float:left; width:80%
    }
    .book-item .content .category{
        text-align:right; float:left; width:20%
    }
    .book-item .content .introduction{
        color:#b1aeae;font-size:12px; height:70px
    }
    .book-item .content .author{
        color:#9db4e5;font-size:13px;font-weight:bold; height:26px
    }
</style>