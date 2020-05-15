<template>
    <div class="defaultForm">
        <el-form :model="userForm" :rules="rules" ref="userForm" size="small"
            label-width="135px" class="demo-userForm">
            <el-form-item label="账号" prop="userCode">
                <el-input v-model="userForm.userCode"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="userForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
                <el-input v-model="userForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roles">
              <el-checkbox-group v-model="userForm.roleIds">
                <el-checkbox v-for="item in roleOptions" :key="item.id" :label="item.id" >{{item.roleName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="联系电话" prop="telephone">
                <el-input v-model="userForm.telephone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('userForm')">立即创建</el-button>
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
                  password: '',
                  telephone: '',
                  roleIds:[]
                },
                rules: {
                  userName: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                  ],
                  userCode: [
                    { required: true, message: '请输入账号' }
                  ],
                  password: [
                    { required: true, message: '请输入密码' }
                  ]
                }
              };
          },
          created(){
              this.initData();
          },
          methods: {
            submitForm(userForm) {
              this.$refs[userForm].validate((valid) => {
                if (valid) {
                  this.postRequest('/ms-book-user-manager/api/user/addUser', this.userForm).then(resp => {
                      this.loading = false;
                      if (resp && !resp.status) {
                          this.$router.push('/org/user-list');
                      }
                  })
                } else {
                  console.log('error submit!!');
                  return false;
                }
              });
            },
            initData(){

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