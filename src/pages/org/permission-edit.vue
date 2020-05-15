<template>
    <div class="defaultForm">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" size="small" label-width="135px" >
            <el-form-item label="所属上级" prop="parentId">
                <el-cascader  v-model="dataForm.parentId"
                              :options="parentCascaderOptions"
                              :props="{ checkStrictly: true }"
                              clearable></el-cascader>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-radio-group v-model="dataForm.type">
                <el-radio label="menu">菜单</el-radio>
                <el-radio label="button">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="dataForm.name"></el-input>
            </el-form-item>
            <el-form-item label="权限" prop="permissionCode">
                <el-input v-model="dataForm.permissionCode" prefix-icon="el-icon-unlock"></el-input>
            </el-form-item>
            <el-form-item label="映射地址" prop="menuUrl">
                <el-input v-model="dataForm.menuUrl"></el-input>
            </el-form-item>
            <el-form-item label="Vue组件路径" prop="componentPath">
                <el-input v-model="dataForm.componentPath"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="imgUrl">
                <icon-picker v-model="dataForm.imgUrl"></icon-picker>
            </el-form-item>
            <el-form-item label="排序" prop="orderValue">
                <el-input v-model.number="dataForm.orderValue" prefix-icon="fa fa-sort-numeric-asc"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('dataForm')">确认</el-button>
                <el-button @click="$router.back(-1)">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                parentCascaderOptions:[],
                dataForm: {
                    parentId: '',
                    type: '',
                    name: '',
                    permissionCode: '',
                    componentPath:'',
                    menuUrl:'',
                    imgUrl: '',
                    orderValue: ''
                },
                rules: {
                    parentId: [
                        { required: true, message: '请选择所属上级', trigger: 'blur' }
                    ], 
                    type: [
                        { required: true, message: '请选择类型', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                        { min: 2, max: 50, message: '名称长度在 1 到 20 个汉字内', trigger: 'blur' }
                    ],
                    orderValue: [
                        { required: true, message: '请输入排序' , trigger: 'blur'},
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
                await this.initParentCascaderOptions();
                await this.getFormData();
            },
            submitForm(dataForm) {
                this.$refs[dataForm].validate((valid) => {
                    if (valid) {
                        this.putRequest('/ms-book-user-manager/api/menu/updateMenu', this.dataForm).then(resp => {
                            if (resp =="") {
                                this.$router.push('/org/permission-list');
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(dataForm) {
                this.$refs[dataForm].resetFields();
            },
            async getFormData(){
                let id = this.$route.params.id;
                this.getRequest('/ms-book-user-manager/api/menu/detailMenu',{id:id}).then(resp => {
                    if (resp && !resp.status) {
                        this.dataForm = resp;
                    }
                })
            },
            async initParentCascaderOptions(){
                // 所属上级数据源
                this.getRequest('/ms-book-user-manager/api/menu/getParentCascader', {}).then(resp => {
                    window.console.log(resp)
                    if (resp && !resp.status) {
                        this.parentCascaderOptions = resp;
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
    .el-cascader {
      width: 50%;
    }
</style>