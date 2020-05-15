<template>
    <div class="defaultForm">
        <el-form :model="userForm" :rules="rules" ref="userForm" size="small"
            label-width="135px" class="demo-userForm">
            <el-form-item label="账号" prop="userCode">
                <span>{{userForm.userCode}}</span>
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
                <el-input v-model="userForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleIds">
              <el-checkbox-group v-model="userForm.roleIds">
                <el-checkbox v-for="(item,index) in roleOptions" :key="index" :label="item.id" name="roles">{{item.roleName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="联系电话" prop="phoneNumber">
                <el-input v-model="userForm.telephone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('userForm')">确认</el-button>
                <el-button @click="$router.back(-1)">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {     
                deptOptions: [],
                roleOptions:[],
                userForm: {
                    userName: '',
                    userCode: '',
                    telephone: '',
                    roleIds:[]
                },
                rules: {
                userName: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ]
                }
            };
        },
        created(){
            this.initForm();
        },
        methods: {
            async initForm(){
                await this.getRolesData();
                await this.getFormData();
            },
            submitForm(userForm) {
                this.$refs[userForm].validate((valid) => {
                if (valid) {
                    this.putRequest('/ms-book-user-manager/api/user/updateUser', this.userForm).then(resp => {
                        if (resp=="") {
                            this.$router.push('/org/user-list');
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            resetForm(userForm) {
                let userId = this.userForm.userId;
                this.$refs[userForm].resetFields();
                this.userForm.userId = userId;
            },
            async getFormData(){
                let id = this.$route.params.id;
                this.getRequest('/ms-book-user-manager/api/user/detailUser',{id:id}).then(resp => {
                    if (resp && !resp.status) {
                        this.userForm = resp;
                    }
                })
            },
            async getRolesData(){
                // 角色
                this.getRequest('/ms-book-user-manager/api/menuRole/listDataAll', {}).then(resp => {
                    if (resp && !resp.status) {
                        this.roleOptions = resp;
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
</style>