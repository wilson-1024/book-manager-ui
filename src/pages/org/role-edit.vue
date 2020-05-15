<template>
    <div class="defaultForm">
        <el-form :model="dataForm" :rules="rules" ref="dataForm" size="small"
            label-width="135px" >
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="dataForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="菜单权限" prop="menuIds">
                <el-tree
                  v-model="dataForm.menuIds"
                  :data="treeData"
                  node-key="id"
                  ref=tree
                  :default-checked-keys="dataForm.menuIds"
                  :props="props"
                  check-strictly=true
                  default-expand-all=true
                  show-checkbox>
                </el-tree>
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
            treeData:[],
            treeDataChecked:[],
            dataForm: {
                id:'',
                menuIds:'',
                roleName: ''
            },
            props: {
            value: 'id',
            label: 'name',
            children: 'children'
            },
            rules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 2, max: 50, message: '名称长度在 1 到 20 个汉字内', trigger: 'blur' }
                ],
                sortNumber: [
                    { required: true, message: '请输入排序' , trigger: 'blur'},
                    { type: 'number', message: '必须为数字！' }
                ]
            }
        };
    },
    created(){
        this.initTreeData();
        this.initTreeCheckedData();
        this.initForm();
    },
    methods: {
        initForm(){
            let id = this.$route.params.id;
            this.getRequest('/ms-book-user-manager/api/menuRole/detailMenuRole',{id:id}).then(resp => {
                if (resp && !resp.status) {
                    this.dataForm = resp;
                }
            })
        },
        initTreeData(){
            // 菜单数据源
            this.getRequest('/ms-book-user-manager/api/menu/getMenuTree', {}).then(resp => {
                if (resp && !resp.status) {
                this.treeData = resp;
                }
            })
        },
        initTreeCheckedData(){
            let id = this.$route.params.id;
            // this.getRequest('/system/org/role/get-role-permissoion-ids', {roleId:id}).then(resp => {
            //     if (resp.code == 200) {
            //     this.treeDataChecked = resp.data;
            //     }
            // })
        },
        submitForm(dataForm) {
            this.dataForm.menuIds = this.$refs.tree.getCheckedKeys();
            this.$refs[dataForm].validate((valid) => {
            if (valid) {
                this.putRequest('/ms-book-user-manager/api/menuRole/updateMenuRole', this.dataForm).then(resp => {
                    if (resp == "") {
                        this.$router.push('/org/role-list');
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