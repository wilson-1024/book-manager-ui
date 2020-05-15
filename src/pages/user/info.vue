<template>
    <div class="defaultForm">
        <el-form :model="userForm" :rules="rules" ref="userForm" size="small" label-width="135px" >

            <el-form-item label="登录名" prop="userCode">
                <span>{{userForm.userCode}}</span>
            </el-form-item>
            <el-form-item label="昵称" prop="userName">
                <el-input v-model="userForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phoneNumber">
                <el-input v-model="userForm.telephone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('userForm')">保存</el-button>
                <el-button @click="$router.back(-1)">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {Message} from 'element-ui';
    export default {
        data() {
            return {
                imageUrl:'',
                userForm: {
                    userCode:'',
                    userName: '',
                    id: '',
                    telephone: '',
                    phoneNumber: '',
                    roleIds:[]
                },
                rules: {
                    userName: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        created(){
            this.initForm();
        },
        methods: {
            async initForm(){
                let user = this.db.get("USER");
                if(user && user.userId){
                    this.userForm = user;
                    this.userForm.attachmentIds = [];
                    this.imageUrl = this.config.baseApi + "/" + user.headImgUrl;
                }else{
                    // 接口获取个人信息
                    this.getRequest('/ms-book-user-manager/api/user/userInfo',{}).then(resp => {
                        if (resp && !resp.status) {
                            this.userForm = resp;
                        }
                    })
                }

            },
            submitForm(userForm) {
                this.$refs[userForm].validate((valid) => {
                if (valid) {
                    let rolesCN = this.userForm.roles;
                    this.userForm.roles = [];
                    this.putRequest('/ms-book-user-manager//api/user/updateUser', this.userForm).then(resp => {
                        this.userForm.roles = rolesCN;
                        if (resp == "") {
                            // 更新本地用户信息
                            let user = this.db.get("USER");
                            user.userName = this.userForm.userName;
                            user.phoneNumber = this.userForm.phoneNumber;
                            this.db.remove("USER");
                            this.db.save("USER",user);
                            Message.success({message: "保存成功拉"})
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
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
        width: 92px;
        height: 92px;
        line-height: 92px;
        text-align: center;
    }
    .avatar {
        width: 92px;
        height: 92px;
        display: block;
    }
</style>