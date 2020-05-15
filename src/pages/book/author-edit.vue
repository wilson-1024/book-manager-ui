<template>
    <div class="defaultForm">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" size="small"
            label-width="135px" >
            <el-form-item label="作者名称" prop="name">
                <el-input v-model="dataForm.name"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="introduction">
                <el-input v-model="dataForm.introduction"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('dataForm')">保存</el-button>
                <el-button @click="$router.back(-1)">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                imageUrl:'',
                dataForm: {
                    id:'',
                    name: '',
                    introduction: '',
                },
                rules: {
                    introduction: [
                        { required: true, message: '请输入简介', trigger: 'blur' }
                    ],name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ]
                }
            };
        },
        created(){
            this.initData();
        },
        methods: {
            submitForm(dataForm) {
                this.$refs[dataForm].validate((valid) => {
                if (valid) {
                    this.putRequest('/ms-book-manager/api/bookAuthor/update', this.dataForm).then(resp => {
                        if (resp.code=="") {
                            this.$router.push('/book/author-list');
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            initData(){
                // 详情
                let id = this.$route.params.id;
                this.getRequest('/ms-book-manager/api/bookAuthor/details', {id:id}).then(resp => {
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
        margin-top: 20px;
        width: 85%
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
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
        width: 128px;
        height: 128px;
        line-height: 128px;
        text-align: center;
    }
    .avatar {
        width: 128px;
        height: 128px;
        display: block;
    }
</style>