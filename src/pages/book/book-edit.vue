<template>
    <div class="defaultForm">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" size="small"
            label-width="100px" >
            <el-row :gutter="30" >
                <el-col :span="12">
                    <div class="grid-content">
                        <el-form-item label="所属分类" prop="dicCategory">
                            <el-select v-model="dataForm.dicCategory" placeholder="请选择分类">
                                <el-option v-for="item in categoryOptions" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属频道" prop="dicChannel">
                            <el-radio-group v-model="dataForm.dicChannel">
                                <el-radio v-for="(item,index) in channelOptions" :key="index" :label="item.id" name="channels">{{item.text}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="连载状态" prop="dicSerialStatus">
                            <el-radio-group v-model="dataForm.dicSerialStatus">
                                <el-radio v-for="(item,index) in serialStatusOptions" :key="index" :label="item.id" name="channels">{{item.text}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="上架状态" prop="onlineStatus">
                            <el-switch
                                    :active-value="1"
                                    :inactive-value="0"
                                v-model="dataForm.onlineStatus"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                                </el-switch>
                        </el-form-item>
                        <el-form-item label="作者" prop="authorId">
                            {{dataForm.authorName}}
                        </el-form-item>
                        <el-form-item label="图书名称" prop="bookName">
                            <el-input v-model="dataForm.bookName"></el-input>
                        </el-form-item>
                        <el-form-item label="BookID" prop="bookId">
                            {{dataForm.bookId}}
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="12" class="row-bg">
                    <div class="grid-content">
                        <el-form-item label="评分" prop="bookScore">
                            <el-rate style="height:32px;line-height:32px; padding-top:5px" v-model="dataForm.bookScore" :max="10" :allow-half="true"> </el-rate>
                        </el-form-item>
                        <el-form-item label="字数" prop="wordCount">
                            <el-input v-model.number="dataForm.wordCount" style="width:150px"><template slot="append">万</template></el-input>
                        </el-form-item>
                        <el-form-item label="ISBN" prop="isbn">
                            <el-input v-model="dataForm.isbn"></el-input>
                        </el-form-item>
                        <el-form-item label="标签" prop="keyWord">
                            <el-input v-model="dataForm.keyWord"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="30" >
                <el-col :span="24">
                    <div class="grid-content-bottom">
                        <el-form-item label="简介" prop="introduction">
                            <el-input type="textarea" :rows="4" v-model="dataForm.introduction"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('dataForm')">保存</el-button>
                            <el-button @click="$router.back(-1)">返回</el-button>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>

            
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                categoryOptions:[],
                channelOptions:[],
                serialStatusOptions:[],
                dataForm: {
                    dicCategory: '',
                    dicChannel: '',
                    dicSerialStatus: '',
                    onlineStatus:'',
                    bookName:'',
                    bookScore: '',
                    keyWord:'',
                    introduction:'',
                    isbn:'',
                    wordCount:'',
                    attachmentIds: []
                },
                rules: {
                    dicCategory: [
                        { required: true, message: '请选择分类！', trigger: 'blur' }
                    ],
                    dicChannel: [
                        { required: true, message: '请选择频道！', trigger: 'blur' }
                    ],
                    dicSerialStatus: [
                        { required: true, message: '请选连载状态！', trigger: 'blur' }
                    ],
                    onlineStatus: [
                        { required: true, message: '请选择上架状态！', trigger: 'blur' }
                    ],
                    bookName: [
                        { required: true, message: '请输入图书名称！', trigger: 'blur' }
                    ],
                    wordCount: [
                        { required: true, message: '请输入字数' },
                        { type: 'number', message: '必须为数字！' }
                    ]
                }
            };
        },
        created(){
            this.initForm();
        },
        methods: {
            async initForm(){
                await this.getDictionaryOptions("category");
                await this.getDictionaryOptions("channel");
                await this.getDictionaryOptions("serial_status");
                await this.getBookDetail();
            },
            submitForm(dataForm) {
                this.$refs[dataForm].validate((valid) => {
                if (valid) {
                    this.putRequest('/ms-book-manager/api/book/update', this.dataForm).then(resp => {
                        if (resp =="") {
                            this.$router.push('/book/list');
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            async getBookDetail(){
                // 详情
                let id = this.$route.params.id;
                this.getRequest('/ms-book-manager/api/book/details', {id:id}).then(resp => {
                    if (resp && !resp.status) {
                        this.dataForm = resp;
                        this.dataForm.attachmentIds = [];
                    }
                })
            },
            async getDictionaryOptions(type){
                // 字典数据源
                this.getRequest('/ms-book-manager/api/dataDictionary/getSelectOptions', {type:type}).then(resp => {
                    if (resp && !resp.status) {
                        if (type == "category"){
                            // 分类
                            this.categoryOptions = resp;
                        } else if (type == "channel"){
                            // 所属频道
                            this.channelOptions = resp;
                        } else if (type == "serial_status"){
                            // 连载状态
                            this.serialStatusOptions = resp;
                        }
                    }
                })
            }

        }
    }
</script>

<style scoped>
    .defaultForm {
        width: 95%;
        margin-top: 5px 
    }

    .grid-content {
        border-radius: 4px;
        margin: 20px
    }
    .grid-content-bottom {
        border-radius: 4px;
        margin: 0px 20px 20px 20px
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #c9c0c0;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 96px;
        height: 128px;
        line-height: 128px;
        text-align: center;
    }
    .avatar {
        width: 96px;
        height: 128px;
        display: block; 
    }
</style>